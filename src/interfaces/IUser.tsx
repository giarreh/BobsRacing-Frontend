export interface User {
    id: number;
    profilename: string;
    password: string,
    username: string;
    credits: number;
    //role
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  }