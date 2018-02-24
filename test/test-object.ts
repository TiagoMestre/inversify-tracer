
export class TestObject {
    public method() { return; }
    public methodWithValue(value: any) { return value; }
    public methodPromiseResolve() { return Promise.resolve(); }
    public methodPromiseResolveWithValue(value: any) { return Promise.resolve(value); }
    public methodPromiseRejectWithValue(value: any) { return Promise.reject(value); }
}
