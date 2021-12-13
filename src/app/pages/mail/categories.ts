
export class Category {
    id = 0;
    name: string | null = null;
    icon: string | null = null;
    count = 0;
    color?: string | null = null;
    selected: boolean;
}

export const mailbox: Category[] = [
    {
        id: 1,
        name: 'Recibidos',
        icon: 'fas fa-inbox',
        count: 5,
        selected: false
    },
    {
        id: 2,
        name: 'Enviado',
        icon: 'fas fa-paper-plane',
        count: 0,
        selected: false

    }

];

export const filter: Category[] = [
    {
        id: 501,
        name: 'Star',
        icon: 'fas fa-star',
        count: 0,
        selected: false

    },
    {
        id: 502,
        name: 'Important',
        icon: 'fas fa-bookmark',
        count: 0,
        selected: false

    }
];

export const label: Category[] = [
    {
        id: 701,
        name: 'Personal',
        icon: 'fas fa-tags',
        count: 0,
        color: '#f62d51',
        selected: false

    },
    {
        id: 702,
        name: 'Work',
        icon: 'fas fa-tags',
        count: 0,
        color: '#2962ff',
        selected: false

    },
    {
        id: 703,
        name: 'Payment',
        icon: 'fas fa-tags',
        count: 0,
        color: '#7460ee',
        selected: false

    },
    {
        id: 704,
        name: 'Invoice',
        icon: 'fas fa-tags',
        count: 0,
        color: '#ffbc34',
        selected: false

    },
    {
        id: 705,
        name: 'Account',
        icon: 'fas fa-tags',
        count: 0,
        color: '#4fc3f7',
        selected: false

    }
];
