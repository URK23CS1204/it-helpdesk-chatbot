import { NextResponse } from "next/server";
import knowledgeBase from "@/knowledge-base.json";

export async function POST(request) {
  try {
    const { message } = await request.json();

    // Convert message to lowercase for matching
    const userMessage = message.toLowerCase();

    // Search knowledge base for matching solution
    const solution = knowledgeBase.find((item) =>
      userMessage.includes(item.problem),
    );

    if (solution) {
      return NextResponse.json({
        response: solution.solution,
        category: solution.category,
        resolved: true,
      });
    }

    // If no solution found, suggest creating ticket
    return NextResponse.json({
      response:
        "I couldn't find an exact solution in my knowledge base. 😔\n\nWould you like to:\n1. Rephrase your question\n2. Create a support ticket for our IT team\n\nYou can click the 'Create Ticket' button on the left sidebar.\n\nCommon issues I can help with:\n- Password reset\n- VPN connection\n- Printer problems\n- Email not syncing\n- Slow computer\n- Internet issues\n- Software installation\n- Screen/monitor problems",
      resolved: false,
      ticketCreated: false,
    });
  } catch (error) {
    return NextResponse.json(
      {
        response:
          "Oops! Something went wrong. Please try again or contact IT support.",
        resolved: false,
      },
      { status: 500 },
    );
  }
}
