// テスト・ローカル用の簡易KV（Workers KV の get/put だけ再現）
export class FakeKV {
  constructor() { this.m = new Map(); this.puts = 0; }
  async get(k, type) {
    const v = this.m.get(k);
    if (v === undefined) return null;
    return type === "json" ? JSON.parse(v) : v;
  }
  async put(k, v) { this.puts++; this.m.set(k, String(v)); }
}
