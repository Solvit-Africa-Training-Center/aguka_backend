import bcrypt from 'bcrypt';
import { User } from '../database/models/user';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET as string;

class UserService{
    async createUser(data: {name: string, email: string, password: string, phoneNumber: string, role: string})
    {
        const hashedPassword = await bcrypt.hash(data.password,10);
        const allowedRoles = ["admin", "president", "secretary", "treasurer", "user"] as const;
        const role = allowedRoles.includes(data.role as any) ? data.role as typeof allowedRoles[number] : "user";
    return await User.create({ ...data, password: hashedPassword, role, groupId: null });
    }

    async getAllUsers(){
        return await User.findAll();
    }

    async getUserById(id:string){
        return await User.findByPk(id);
    }
    async updateUser(id:string,data: Partial<{
        name:string;
        email:string;
        phoneNumber:string;
        password:string;
        role:string;
        groupId:string;
    }>){
        const user = await User.findByPk(id);
        if(!user)return null;

        if (data.password){
            data.password = await bcrypt.hash(data.password,10);
        }

        if (data.role) {
            const allowedRoles = ["admin", "president", "secretary", "treasurer", "user"] as const;
            data.role = allowedRoles.includes(data.role as any)
                ? data.role as typeof allowedRoles[number]
                : "user";
        }

        // Ensure role is of the correct type for update
        const updateData = {
            ...data,
            role: data.role as ("admin" | "president" | "secretary" | "treasurer" | "user" | undefined)
        };

        await user.update(updateData);
        return user;
    }
    async deleteUser(id:string){
        const user = await User.findByPk(id);
        if(!user) return null;

        await user.destroy();
        return true;
    }

    async login(email: string, phoneNumber: string, password: string){
        const user = await User.findOne({where: {email:email || phoneNumber}});
        if(!user) throw new Error("Invalid email or password");

        const isMatch = await bcrypt.compare(password, user.password || "");
        if(!isMatch) throw new Error("Invalid email or password");


        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }
        const token = jwt.sign({
            id: user.id,
            role: user.role,
            email: user.email
        }, JWT_SECRET, {
            expiresIn: '1d'
        });

        return { token};
    }

    async assignGroup(id:string, groupId:string){
        const user = await User.findByPk(id);
        if(!user) 
            return null;

        await user.update({groupId});
        return user;
    }

}

export default new UserService();