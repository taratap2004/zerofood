import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

export async function GET() {
    let prisma: PrismaClient | null = null

    try {
        prisma = new PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        })

        // ทดสอบการเชื่อมต่อ
        await prisma.$connect()

        // ทดสอบ query ง่ายๆ
        const result = await prisma.$queryRaw`SELECT 1 as test`

        // ทดสอบ table User exists
        const userCount = await prisma.user.count()

        return NextResponse.json({
            status: "success",
            message: "Database connection successful",
            result: result,
            userCount: userCount,
            env: {
                hasDbUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV
            }
        })

    } catch (error: any) {
        console.error('Database test error:', error)

        return NextResponse.json({
            status: "error",
            message: error.message,
            code: error.code || 'UNKNOWN',
            env: {
                hasDbUrl: !!process.env.DATABASE_URL,
                dbUrlLength: process.env.DATABASE_URL?.length || 0
            }
        }, { status: 500 })

    } finally {
        if (prisma) {
            await prisma.$disconnect()
        }
    }
}