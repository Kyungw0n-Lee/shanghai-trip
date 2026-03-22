-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Trips
create table trips (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  start_date  date not null,
  end_date    date not null,
  password    text not null,
  budget_cny  numeric default 0,
  created_at  timestamptz default now()
);

-- Schedule Items
create table schedule_items (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,
  day_index   int not null,
  sort_order  int not null default 0,
  time        text,
  title       text not null,
  memo        text,
  is_reserved boolean default false,
  cost        numeric default 0,
  place_id    uuid,
  created_at  timestamptz default now()
);

-- Checklist Items
create table checklist_items (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,
  category    text not null,
  content     text not null,
  is_checked  boolean default false,
  is_template boolean default false,
  sort_order  int not null default 0,
  created_at  timestamptz default now()
);

-- Expenses
create table expenses (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,
  date        date not null,
  category    text not null,
  amount_cny  numeric not null,
  memo        text,
  created_at  timestamptz default now()
);

-- Places
create table places (
  id              uuid primary key default gen_random_uuid(),
  trip_id         uuid not null references trips(id) on delete cascade,
  name            text not null,
  address         text,
  lat             numeric,
  lng             numeric,
  tag             text not null default '관광지',
  memo            text,
  google_place_id text,
  created_at      timestamptz default now()
);

-- Photos
create table photos (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,
  ref_type    text not null check (ref_type in ('place','schedule_item','checklist_item')),
  ref_id      uuid not null,
  storage_url text not null,
  caption     text,
  created_at  timestamptz default now()
);

-- RLS: 모든 테이블 공개 읽기 허용 (서비스 롤로 쓰기)
alter table trips enable row level security;
alter table schedule_items enable row level security;
alter table checklist_items enable row level security;
alter table expenses enable row level security;
alter table places enable row level security;
alter table photos enable row level security;

create policy "public read trips" on trips for select using (true);
create policy "public read schedule_items" on schedule_items for select using (true);
create policy "public read checklist_items" on checklist_items for select using (true);
create policy "public read expenses" on expenses for select using (true);
create policy "public read places" on places for select using (true);
create policy "public read photos" on photos for select using (true);
