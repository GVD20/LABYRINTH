-- 清理脚本：删除旧消息与空/闲置房间，并建立必要索引
-- 说明：默认保留 15 天，若需要修改请调整 cron 任务或调用参数

-- 1. 创建索引（若不存在）
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON public.rooms (created_at);
CREATE INDEX IF NOT EXISTS idx_rooms_status_created_at ON public.rooms (status, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at);
CREATE INDEX IF NOT EXISTS idx_messages_room_created_at ON public.messages (room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_type_created_at ON public.messages (type, created_at);

-- 2. 清理函数：删除超过 p_days 的消息；删除创建时间超过 p_days 且处于 waiting 或无消息的房间
CREATE OR REPLACE FUNCTION public.clean_old_data(p_days integer DEFAULT 15)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  -- 删除旧消息
  DELETE FROM public.messages
  WHERE created_at < now() - (p_days || ' days')::interval;

  -- 删除旧房间：创建时间超过 p_days，且状态为 waiting，或无任何消息（认为未使用）
  DELETE FROM public.rooms r
  WHERE r.created_at < now() - (p_days || ' days')::interval
    AND (
      r.status = 'waiting'
      OR NOT EXISTS (
        SELECT 1 FROM public.messages m WHERE m.room_id = r.id
      )
    );
END;
$$;

-- 3. （可选）如果数据库支持 pg_cron，可创建定时任务每天凌晨 03:00 执行
-- 注意：部分托管服务（如 Supabase 免费实例）可能不允许安装扩展或使用 pg_cron
-- 若不支持，请改为在外部运维系统（如 server cron、云函数）定时调用： SELECT public.clean_old_data(15);
DO $$
BEGIN
  -- 尝试创建扩展（若无权限此语句可能失败，可注释掉）
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_cron;
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'pg_cron extension not available or permission denied.';
  END;

  -- 尝试注册任务
  BEGIN
    PERFORM cron.schedule('clean_old_data_daily', '0 3 * * *', 'SELECT public.clean_old_data(15);');
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Failed to schedule pg_cron job (maybe not supported).';
  END;
END;
$$;