export class User {

    _id: string
    FBuserID: string
    username: string
    email: string
    password: string
    passwordConfirmation: string // Frontend only!

    customer: {
        id: string,
        source: string
    }
    description: string
    rating: number
    phone: number
    postalcode: number
    address: string
    idOfPhoto1: string
    idOfPhoto2: string
    bankAccount: string

    isVerified: boolean
    isLocked: boolean
    isBanned: boolean
    userRole: string
    status: string
    affiliateCode: string
}
