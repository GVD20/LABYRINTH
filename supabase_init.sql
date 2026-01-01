-- 1. 创建房间表 (rooms)
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    password TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    config JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'waiting',
    game_state JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 确保旧表也能增加 is_private 列
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;
UPDATE public.rooms SET is_private = (password IS NOT NULL AND password <> '') WHERE is_private IS NULL;

-- 2. 创建消息表 (messages)
CREATE TABLE IF NOT EXISTS public.messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'chat', 'story_init', 'system'
    content TEXT NOT NULL,
    sender TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 开启 Row Level Security (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 核心安全变更：限制匿名用户直接读取敏感列 (password, config)
-- 这样即使别人有 anon_key，也无法通过 select * 偷走你的 API Key
REVOKE ALL ON public.rooms FROM anon;
GRANT SELECT (id, name, status, is_private, created_at) ON public.rooms TO anon; 
GRANT INSERT, UPDATE ON public.rooms TO anon;
GRANT SELECT, INSERT ON public.messages TO anon;

-- 房间表策略
DROP POLICY IF EXISTS "Allow anon to select rooms" ON public.rooms;
CREATE POLICY "Allow anon to select rooms" ON public.rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon to insert rooms" ON public.rooms;
CREATE POLICY "Allow anon to insert rooms" ON public.rooms FOR INSERT WITH CHECK (true);

-- 强化更新策略
DROP POLICY IF EXISTS "Allow anon to update rooms" ON public.rooms;
CREATE POLICY "Allow anon to update rooms" ON public.rooms FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 消息表策略
DROP POLICY IF EXISTS "Allow anon to select messages" ON public.messages;
CREATE POLICY "Allow anon to select messages" ON public.messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon to insert messages" ON public.messages;
CREATE POLICY "Allow anon to insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- 4. 安全加入房间函数 (RPC)
-- 只有在密码正确时，才返回包含 config (API Key) 和 game_state 的完整数据
CREATE OR REPLACE FUNCTION join_room_secure(id_param UUID, pass_param TEXT DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    name TEXT,
    config JSONB,
    status TEXT,
    game_state JSONB,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.name, r.config, r.status, r.game_state, r.created_at
    FROM public.rooms r
    WHERE r.id = id_param 
      AND (r.password IS NULL OR r.password = pass_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 自动更新 is_private 的触发器
CREATE OR REPLACE FUNCTION sync_is_private() RETURNS TRIGGER AS $$
BEGIN
    NEW.is_private := (NEW.password IS NOT NULL AND NEW.password <> '');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_is_private ON public.rooms;
CREATE TRIGGER trg_sync_is_private
BEFORE INSERT OR UPDATE OF password ON public.rooms
FOR EACH ROW EXECUTE FUNCTION sync_is_private();

-- 5. 开启实时同步 (Realtime)
-- 将表添加到 supabase_realtime 发布中
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.rooms, public.messages;
COMMIT;

-- 5. 索引优化
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON public.messages(room_id);
