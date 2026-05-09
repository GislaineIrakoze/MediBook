import User from "../models/users.js";
import bcrypt from 'bcrypt';

export const seedUsers = async () => {
    const usersData = [
        {
            fullname: 'John Doe',
            email: 'test@gmail.com',
            password: await bcrypt.hash('password123', 10),
            dob: '1990-01-01',
            gender:'male',
            profilePicture: null,
            status: 'active',
            emergencyContact: '+250788826957',
            PhoneNumber: '+250791749219',
            location: 'kigali',
            role: 'patient',
        },
        {
            fullname: 'aime',
            email: 'test1@gmail.com',
            password: await bcrypt.hash('password123', 10),
            dob: '1990-01-01',
            gender:'male',
            profilePicture: null,
            status: 'active',
            emergencyContact: '+250788826958',
            PhoneNumber: '+250791749217',
            location: 'kigali',
            role: 'doctor',
        },
        {
            fullname: 'Admin User',
            email: 'admin@gmail.com',
            password: await bcrypt.hash('admin123', 10),
            dob: '1985-01-01',
            gender: 'other',
            profilePicture: null,
            status: 'active',
            emergencyContact: '+250788826959',
            PhoneNumber: '+250791749210',
            location: 'kigali',
            role: 'admin',
        }
    ];

    for (const userData of usersData) {
        await User.create(userData);
    }
}