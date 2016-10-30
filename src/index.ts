
import { Watcher } from './watcher';

export function inversifyWatcher(): Watcher {
    return new Watcher();
}
