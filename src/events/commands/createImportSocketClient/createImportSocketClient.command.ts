import { CreateImportSocketClientMessageBody } from "./createImportSocketClient.message-body";

export class CreateImportSocketClientCommand {
    constructor(public readonly body: CreateImportSocketClientMessageBody) {}
}