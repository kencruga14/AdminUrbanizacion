import { Injectable } from '@angular/core';
import { Mailbox } from './mailbox';
import { mailboxList } from './mailbox-data';
import { User } from './user-data';


@Injectable()
export class MailGlobalVariable {
    public page = 1;
    public pageSize = 6;
    public collectionSize = 0;

    public topLable = '';
    public mailList: any = [];
    public selectedMail: Mailbox | null = null;
    public selectedUser: User | null = null;

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
    replyShow = false;
    addClass = true;
    type = '';

}


@Injectable()
export class MailService {

    public getInbox() {
        return mailboxList.filter(mail => mail.mailbox === 'Bandeja');
    }
    public getSent() {
        return mailboxList.filter(mail => mail.mailbox === 'Enviado');
    }

}
