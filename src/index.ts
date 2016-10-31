
import { Watcher } from './watcher';
import { WatcherOptions } from './interfaces';

export { WatcherOptions, CallInfo, ReturnInfo } from './interfaces';

export function inversifyWatcher(options?: WatcherOptions): Watcher {
    return new Watcher(options);
}
