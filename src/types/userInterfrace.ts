export interface  UserInterface{
    name:string;
    email:string;
    phoneNumber:string;
    password:string;
    role:'admin'|'president'|'secretary'|'treasurer'|'user';
    status:'active'|'inactive'|'suspended';
    groupId:string;
    createdAt:Date;
    updatedAt:Date;

}