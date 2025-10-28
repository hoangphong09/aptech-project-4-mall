"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ShoppingBag, Upload } from "lucide-react"
import { axiosAuth } from "@/lib/axios"
import { AxiosError } from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import Image from "next/image"
import { useSession } from "next-auth/react"
import Header from "@/components/header"

export default function ProfilePage(){
    const {data:session, status} = useSession()

    const [profile, setProfile] = useState({
        username: "",
        fullName: "",
        email: "",
        emailVerified: false,
        phone: "",
        avatarUrl: "",
        registeredAt: "",
        lastLogin: ""
    })

    useEffect(()=>{
        if (status === "unauthenticated") router.push("/login");
        if (status === "authenticated") getProfile();
    }, [status])

    const getProfile = async () => {
        try {
        const res = await axiosAuth.get("/api/auth/profile", 
            {
                headers: {
                    "Authorization": `Bearer ${session?.user.accessToken}`,
                },
                withCredentials: true
            })
            if (res.status === 200){
                setProfile({ ...profile, 
                    username: res.data.username,
                    email: res.data.email,
                    emailVerified: res.data.emailVerified,
                    phone: res.data.phone,
                    avatarUrl: res.data.avatarUrl,
                    fullName: res.data.fullName })
            }
        } catch (e){

        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0])
            const fileReader = new FileReader()
            fileReader.onload = (event) => {
                setProfile((prev) => ({ ...prev, avatarUrl: event.target?.result as string }))
            }
            fileReader.readAsDataURL(e.target.files[0])
        }
    }

    const handleSave = async () => {
        try {

            const formData = new FormData();
            formData.append("username", profile.username);
            formData.append("fullName", profile.fullName);
            formData.append("phone", profile.phone);
            formData.append("avatarUrl", profile.avatarUrl);

            if (avatarFile) formData.append("avatar", avatarFile);

            const res = await axiosAuth.post("/api/auth/profile",
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${session?.user.accessToken}`,
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                })
        } catch {

        }
    }

    const changeCredentials = async (e: React.FormEvent) => {
      e.preventDefault();

    }

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible1, setPasswordVisible1] = useState(false);

    const [newEmail, setNewEmail] = useState(profile.email)
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')

    const router = useRouter()

    return (
      <div>
        <Header/>
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Image
                src={process.env.NEXT_PUBLIC_BACKEND_URL + profile.avatarUrl || "/default-avatar.png"}
                alt="User Avatar"
                width={128}
                height={128}
                className="rounded-full border object-cover"
              />
              <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full cursor-pointer shadow-md">
                <Upload className="w-5 h-5 text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} readOnly/>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle>Update Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="new-email">Change Email</Label>
            <div className="relative">
              <Input
                id="new-email"
                type="text"
                value={newEmail}
                placeholder={profile.email}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <Label htmlFor="password">Old Password</Label>
            <div className="relative">
                <Input
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                />
                <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-2 text-gray-500"
                >
                    {passwordVisible ? <EyeOff /> : <Eye />}
                </button>
            </div>

            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
                <Input
                id="new-password"
                type={passwordVisible1 ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                />
                <button
                type="button"
                onClick={() => setPasswordVisible1(!passwordVisible1)}
                className="absolute right-3 top-2 text-gray-500"
                >
                    {passwordVisible1 ? <EyeOff /> : <Eye />}
                </button>
            </div>
          </div>
            <Button variant="secondary" onClick={(e) => changeCredentials(e)}>
                Update Email/Password
            </Button>
        </CardContent>
      </Card>
    </div>
    </div>
    )
}