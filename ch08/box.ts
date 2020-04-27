export declare interface IBox {
  locked: boolean;
  unlock: Function;
  lock: Function;
  _content: any[];
  content: any[];
}

export default function withBoxUnlocked(box: IBox, unlockedFunction: Function) {
  box.unlock();
  try {
    return unlockedFunction();
  } finally {
    box.lock();
  }
}
