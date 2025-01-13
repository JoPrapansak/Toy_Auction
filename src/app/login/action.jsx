'use server'
export async function login(formData){
    const email = formData.get('email')
    const password = formData.get('password')

    console.log(email,password)
} 
