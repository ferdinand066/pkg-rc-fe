const USER_ROLE_INT = 1;
const ADMIN_ROLE_INT = 2;

const BORROWED_STATUS = ['Dibatalkan', 'Pending', 'Disetujui']

const USER_ROLE_MAPPING = [
    {
        id: USER_ROLE_INT,
        name: 'User'
    },
    {
        id: ADMIN_ROLE_INT,
        name: 'Admin'
    }
]

export { USER_ROLE_INT, ADMIN_ROLE_INT, USER_ROLE_MAPPING, BORROWED_STATUS }