import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client()
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjId)
        this.account = new Account(this.client)
    }

    async createAccount({ email, password, name }) {
        try {
            const accountCreate=await this.account.create(ID.unique(),email,password,name)
            if (accountCreate){
                //call another method
                return this.login({email,password})
            }else{
                return accountCreate
            }
            
        } catch (error) {
            throw error
        }

    }

    async login({email,password}){
        try {
            return await this.account.createEmailPasswordSession(email,password)
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get()
        } catch (error) {
            if (error.code===401){
                return null
            }
            throw error
        }
    }

    async logout(){
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            throw error
        }
    }

}

const authservice = new AuthService()


export default authservice