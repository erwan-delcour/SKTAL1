"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Plus, Trash } from "lucide-react"

export function UserManagement() {
  // Mock data for users
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john.doe@company.com", role: "Employee", department: "Engineering" },
    { id: 2, name: "Alice Smith", email: "alice.smith@company.com", role: "Secretary", department: "Administration" },
    { id: 3, name: "Bob Johnson", email: "bob.johnson@company.com", role: "Employee", department: "Marketing" },
    { id: 4, name: "Emma Wilson", email: "emma.wilson@company.com", role: "Employee", department: "Finance" },
    { id: 5, name: "Mike Green", email: "mike.green@company.com", role: "Manager", department: "Executive" },
  ])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input placeholder="Search users..." className="max-w-sm" />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account in the system.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="employee">
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="secretary">Secretary</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue="engineering">
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="administration">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Department</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y">
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-5 gap-4 p-4 items-center">
              <div>{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div>{user.role}</div>
              <div>{user.department}</div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
