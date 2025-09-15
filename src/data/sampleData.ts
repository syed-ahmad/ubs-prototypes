export interface User {
  id: number
  name: string
  email: string
  department: string
  role: string
  status: string
  joinDate: string
  salary: number
}

export const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    role: "Senior Developer",
    status: "Active",
    joinDate: "2022-01-15",
    salary: 95000
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    department: "Design",
    role: "UX Designer",
    status: "Active",
    joinDate: "2021-08-22",
    salary: 78000
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    department: "Engineering",
    role: "Frontend Developer",
    status: "Active",
    joinDate: "2023-03-10",
    salary: 82000
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    department: "Marketing",
    role: "Marketing Manager",
    status: "Active",
    joinDate: "2020-11-05",
    salary: 72000
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@company.com",
    department: "Engineering",
    role: "DevOps Engineer",
    status: "Inactive",
    joinDate: "2022-06-18",
    salary: 88000
  },
  {
    id: 6,
    name: "Lisa Davis",
    email: "lisa.davis@company.com",
    department: "HR",
    role: "HR Specialist",
    status: "Active",
    joinDate: "2021-12-03",
    salary: 65000
  },
  {
    id: 7,
    name: "Tom Anderson",
    email: "tom.anderson@company.com",
    department: "Sales",
    role: "Sales Representative",
    status: "Active",
    joinDate: "2023-01-20",
    salary: 58000
  },
  {
    id: 8,
    name: "Emily Taylor",
    email: "emily.taylor@company.com",
    department: "Design",
    role: "Product Designer",
    status: "Active",
    joinDate: "2022-09-14",
    salary: 75000
  },
  {
    id: 9,
    name: "Chris Martinez",
    email: "chris.martinez@company.com",
    department: "Engineering",
    role: "Backend Developer",
    status: "Active",
    joinDate: "2021-04-07",
    salary: 90000
  },
  {
    id: 10,
    name: "Amanda White",
    email: "amanda.white@company.com",
    department: "Finance",
    role: "Financial Analyst",
    status: "Active",
    joinDate: "2022-11-28",
    salary: 68000
  },
  {
    id: 11,
    name: "Kevin Lee",
    email: "kevin.lee@company.com",
    department: "Engineering",
    role: "Full Stack Developer",
    status: "Active",
    joinDate: "2023-05-16",
    salary: 85000
  },
  {
    id: 12,
    name: "Rachel Green",
    email: "rachel.green@company.com",
    department: "Marketing",
    role: "Content Specialist",
    status: "Inactive",
    joinDate: "2020-07-12",
    salary: 55000
  }
]

export const userColumns = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name' as keyof User,
    width: 150
  },
  {
    id: 'email',
    header: 'Email',
    accessor: 'email' as keyof User,
    width: 200
  },
  {
    id: 'department',
    header: 'Department',
    accessor: 'department' as keyof User,
    width: 120
  },
  {
    id: 'role',
    header: 'Role',
    accessor: 'role' as keyof User,
    width: 150
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status' as keyof User,
    width: 100
  },
  {
    id: 'joinDate',
    header: 'Join Date',
    accessor: 'joinDate' as keyof User,
    width: 120
  },
  {
    id: 'salary',
    header: 'Salary',
    accessor: ((row: User) => `$${row.salary.toLocaleString()}`) as any,
    width: 120
  }
]