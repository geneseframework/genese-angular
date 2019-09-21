export const BOOKS = [
    {
        id: 1,
        title: 'The caves of steel',
        description: 'In this novel, Isaac Asimov introduces Elijah Baley and R. Daneel Olivaw, later his favorite protagonists',
        authors: ['Isaac Asimov'],
        irrelevantProperty: 'Irrelevant',
        editions: [
            {
                name: 'La découverte',
                year: '1972'
            },
            {
                name: 'Gallimard',
                year: '1978'
            },
        ],
        editor: {
            name: 'La pléiade',
            place: {
                city: 'Paris',
                country: 'France',
                street: 'Champs-Elysées'
            },
            collection: undefined
        },
        available: true,
        translatedFields: {
            en: {
                type: 'novels'
            },
            fr: {
                type: 'nouvelles'
            }
        }
    },
    {
        id: 2,
        title: 'The naked sun',
        description: 'The story arises from the murder of Rikaine Delmarre',
        author: 'Isaac Asimov'
    },
    {
        id: 3,
        title: 'The robots of dawn',
        description: 'Detective Elijah Baley of Earth is training with his son and others to overcome their socially ingrained agoraphobia',
        author: 'Isaac Asimov'
    },
    {
        id: 4,
        title: 'Robots and Empire',
        description: 'The Earthman Elijah Baley (the detective hero of the previous Robot books) has died nearly two centuries earlier',
        author: 'Isaac Asimov'
    },
    {
        id: 5,
        title: 'The Currents of Space',
        description: 'The story takes place in the context of Trantor\'s rise from a large regional power to a galaxy-wide empire',
        author: 'Isaac Asimov'
    },
    {
        id: 6,
        title: 'The Stars',
        description: 'The story was first published with the title Tyrann in Galaxy magazine',
        author: 'Isaac Asimov'
    },
    {
        id: 7,
        title: 'The Mysterious Affair at Styles',
        description: 'A detective novel by British writer Agatha Christie. It was written in the middle of the First World War, in 1916',
        author: 'Agatha Christie'
    },
    {
        id: 8,
        title: 'Richard III',
        description: 'A historical play by William Shakespeare believed to have been written around 1593',
        author: 'William Shakespeare'
    },
    {
        id: 9,
        title: 'Hamlet',
        description: 'A tragedy written by William Shakespeare sometime between 1599 and 1602',
        author: 'William Shakespeare'
    },
    {
        id: 10,
        title: 'The Secret Adversary',
        description: 'The second published detective fiction novel by British writer Agatha Christie, first published in January 1922',
        author: 'Agatha Christie'
    },
    {
        id: 11,
        title: 'The Murder on the Links',
        description: 'A work of detective fiction by Agatha Christie',
        author: 'Agatha Christie'
    },
    {
        id: 12,
        title: 'Othello',
        description: 'A tragedy by William Shakespeare, believed to have been written in 1603',
        author: 'William Shakespeare'
    },
];

export const BOOK = BOOKS[0];
