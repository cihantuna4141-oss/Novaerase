import { NextResponse } from "next/server";
import { prisma } from "@/lib/Prismadb";
import { transporter } from "@/lib/Mail"; // Use your existing Mail utility

export async function POST(req: Request) {
  const { identifier } = await req.json();
  const admin = await prisma.admin.findUnique({ where: { email: identifier } });

  if (!admin)
    return NextResponse.json({ error: "Access Denied, No User Found" }, { status: 404 });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      verificationCode: code,
      codeExpires: new Date(Date.now() + 15 * 60000), // 15 mins
    },
  });

  await transporter.sendMail({
    from: `"Perfect Man Security" <${process.env.EMAIL_USER}>`,
    to: admin.email,
    subject: "🛡️ Admin Recovery Code",
    html: `<div style="background:#000; padding:20px; color:#fff; font-family:sans-serif;">
            <h2>Perfect Man Hub Recovery</h2>
            <p>Your security reset code is: <b style="color:#f59e0b; font-size:24px;">${code}</b></p>
            <p>This code expires in 15 minutes.</p>
           </div>`,
  });

  return NextResponse.json({ success: true });
}
