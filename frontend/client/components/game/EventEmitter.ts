type EventHandler<T=any> = (payload: T) => void

export class EventEmitter {

  events: {[name: string]: EventHandler[]} = {}

  on<T=any>(eventName: string, handler: EventHandler<T>):void {
    if(!this.events[eventName]){
      this.events[eventName] = []
    }
    this.events[eventName].push(handler as EventHandler)
  }

  emit<T=any>(eventName: string, payload: T): void {
    const handlers = this.events[eventName]
    if(handlers){
      handlers.forEach((handler) => handler(payload))
    }
  }



}