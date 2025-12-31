-- 1. 创建房间表 (rooms)
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    password TEXT,
    config JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'waiting',
    game_state JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

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
-- 为了方便演示和匿名访问，我们为 anon 角色开启所有权限
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 房间表权限：允许匿名用户查看、创建和更新房间状态
CREATE POLICY "Allow anon to select rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Allow anon to insert rooms" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon to update rooms" ON public.rooms FOR UPDATE USING (true);

-- 消息表权限：允许匿名用户查看和发送消息
CREATE POLICY "Allow anon to select messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow anon to insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- 4. 开启实时同步 (Realtime)
-- 将表添加到 supabase_realtime 发布中
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.rooms, public.messages;
COMMIT;

-- 5. 索引优化
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON public.messages(room_id);
