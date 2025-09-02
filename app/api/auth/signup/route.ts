// import { NextRequest, NextResponse } from "next/server"
// import { PrismaClient } from "@prisma/client"
// import bcrypt from "bcryptjs"

// const prisma = new PrismaClient()

// export async function POST(request: NextRequest) {
//   try {
//     const { ownerName, email, password, restaurantName } = await request.json()

//     if (!ownerName || !email || !password || !restaurantName) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       )
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: { email }
//     })

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       )
//     }

//     const hashedPassword = await bcrypt.hash(password, 12)

//     const user = await prisma.user.create({
//       data: {
//         ownerName,
//         email,
//         password: hashedPassword,
//         restaurantName,
//         restaurantDescription: null,
//         restaurantAddress: null,
//         restaurantPhone: null,
//         restaurantEmail: email, // Use user email as default restaurant email
//         isRestaurantActive: true
//       }
//     })

//     return NextResponse.json(
//       { message: "User and restaurant created successfully", userId: user.id },
//       { status: 201 }
//     )
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }
// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ownerName, email, password, restaurantName } = body

    console.log('Signup attempt:', { email, hasPassword: !!password, restaurantName })

    // Basic validation
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "กรุณากรอกอีเมลและรหัสผ่าน" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "รูปแบบอีเมลไม่ถูกต้อง" },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      )
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user - make fields optional as per schema
    const userData = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      ownerName: ownerName?.trim() || null,
      restaurantName: restaurantName?.trim() || null,
      restaurantEmail: email.toLowerCase().trim(),
      isRestaurantActive: true
    }

    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' })

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        ownerName: true,
        restaurantName: true,
        isRestaurantActive: true,
        createdAt: true
      }
    })

    console.log('User created successfully:', user)

    return NextResponse.json(
      {
        message: "สมัครสมาชิกสำเร็จ",
        user: user
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Signup error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    })

    // Prisma specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 409 }
      )
    }

    if (error.code === 'P1001' || error.code === 'P1017') {
      return NextResponse.json(
        { error: "ไม่สามารถเชื่อมต่อฐานข้อมูลได้" },
        { status: 503 }
      )
    }

    // Connection timeout
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      return NextResponse.json(
        { error: "เชื่อมต่อฐานข้อมูลหมดเวลา กรุณาลองใหม่" },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        error: "เกิดข้อผิดพลาดระบบ กรุณาลองใหม่อีกครั้ง",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}