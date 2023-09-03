import { LiveSocket } from "phoenix_live_view";

interface LiveViewHookBase {
  mounted(): void;
  beforeUpdate(): void;
  updated(): void;
  destroyed(): void;
  disconnected(): void;
  reconnected(): void;
}

export abstract class LiveViewHook implements LiveViewHookBase {
  el!: HTMLElement;
  liveSocket!: LiveSocket;

  init(): void {}

  /**
   * The element has been added to the DOM and its server LiveView has finished mounting
   */
  mounted(): void {}

  /**
   * The element is about to be updated in the DOM. Note: any call here must be synchronous as the operation cannot be deferred or cancelled.
   */
  beforeUpdate(): void {}

  /**
   * The element has been updated in the DOM by the server
   */
  updated(): void {}

  /**
   * The element has been removed from the page, either by a parent update, or by the parent being removed entirely
   */
  destroyed(): void {}

  /**
   * The element's parent LiveView has disconnected from the server
   */
  disconnected(): void {}

  /**
   * The element's parent LiveView has reconnected to the server
   */
  reconnected(): void {}

  /**
   * Method to push an event from the client to the LiveView server
   */
  protected pushEvent<T>(
    _event: string,
    _payload: T,
    _callback?: <TReply>(reply: TReply, ref: number) => void
  ): void {}

  /**
   * Method to push targeted events from the client to LiveViews and LiveComponents.
   * It sends the event to the LiveComponent or LiveView the selectorOrTarget is defined
   * in, where its value can be either a query selector or an actual DOM element. If the
   * query selector returns more than one element it will send the event to all of them,
   * even if all the elements are in the same LiveComponent or LiveView.
   */
  protected pushEventTo<T>(
    _selectorOrTarget: Element | string,
    _event: string,
    _payload: T,
    _callback?: <TReply>(reply: TReply, ref: number) => void
  ): void {}

  /**
   * Method to handle an event pushed from the server
   */
  protected handleEvent(
    _event: string,
    _callback: <T>(payload: T) => void
  ): void {}

  /**
   * Method to inject a list of file-like objects into an uploader.
   */
  protected upload(_name: string, _files: FileList): void {}

  /**
   * Method to inject a list of file-like objects into an uploader. The hook will send
   * the files to the uploader with name defined by allow_upload/3 on the server-side.
   * Dispatching new uploads triggers an input change event which will be sent
   * to the LiveComponent or LiveView the selectorOrTarget is defined in, where its
   * value can be either a query selector or an actual DOM element.
   * If the query selector returns more than one live file input,
   * an error will be logged.
   */
  protected uploadTo(
    _selectorOrTarget: Element | string,
    _name: string,
    _files: FileList
  ): void {}
}

const methodsToSkip = ["constructor"];

export function createHook(hook: typeof LiveViewHook): LiveViewHook {
  const methodNames = Object.getOwnPropertyNames(hook.prototype).filter(
    (name) => !methodsToSkip.includes(name)
  ) as Array<keyof LiveViewHookBase>;

  const methods = methodNames.map((name) => [name, hook.prototype[name]]);
  const inst = Object.fromEntries(methods);

  return inst;
}
