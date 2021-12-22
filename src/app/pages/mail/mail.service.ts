import { Injectable } from '@angular/core';
import { Mailbox } from './mailbox';
import { mailboxList } from './mailbox-data';
import { User } from './user-data';


@Injectable()
export class MailGlobalVariable {
    public page = 1;
    public pageSize = 6;
    public collectionSize = 0;
    public array : any;
    public topLable = '';
    public mailList: any = [];
    public selectedMail: any;
    public selectedUser: User | null = null;
    public selectedMailId: number = 0
    public users: User[] = [];
    public inboxList: Mailbox[] = [];
    public sentList: Mailbox[] = [];
    public draftList: Mailbox[] = [];
    public spamList: Mailbox[] = [];
    public trashList: Mailbox[] = [];

    public isShow = false;
    inboxCount = 0;
    spamCount = 0;
    draftCount = 0;
    replyShow = true;
    addClass = true;
    type = '';

}


@Injectable()
export class MailService {
    public array : any;
    
    public getInbox() {
        return mailboxList.filter(mail => mail.mailbox === 'Recibidos');
    }
    public getSent() {
        return mailboxList.filter(mail => mail.mailbox === 'Enviado');
    }

}
