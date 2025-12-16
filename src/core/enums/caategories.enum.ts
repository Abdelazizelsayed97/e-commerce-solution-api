import { registerEnumType } from "@nestjs/graphql";

export enum Categories {
 smartPhones = 'smartPhones',
    electronics = 'electronics',
    homeAppliances = 'homeAppliances',
    fashion = 'fashion',
    beauty = 'beauty',
    books = 'books',
    sports = 'sports',
    health = 'health',
    food = 'food',
}

registerEnumType(Categories, { name: 'Categories' });