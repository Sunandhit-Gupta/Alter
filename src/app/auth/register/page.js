"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        rollNumber: '',
        batch: '',
        courseCodes: ''
    });
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/register', {
                ...formData,
                courseCodes: formData.courseCodes.split(',')
            });
            alert('Registration successful!');
            console.log(res.data);
            router.push('/auth/login'); // Redirect to login after registration
        } catch (error) {
            alert('Registration failed!');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
                {formData.role === 'student' && (
                    <>
                        <input type="text" name="rollNumber" placeholder="Roll Number" value={formData.rollNumber} onChange={handleChange} required />
                        <input type="text" name="batch" placeholder="Batch" value={formData.batch} onChange={handleChange} />
                        <input type="text" name="courseCodes" placeholder="Course Codes (comma separated)" value={formData.courseCodes} onChange={handleChange} />
                    </>
                )}
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <button onClick={() => router.push('/auth/login')}>Login here</button></p>
        </div>
    );
}
