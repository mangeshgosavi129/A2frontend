import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PolicyPage() {
    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <article className="prose prose-invert prose-zinc max-w-none">
                    <div className="mb-12 border-b border-zinc-800 pb-8">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-zinc-400">
                            Tasks Management System (TMS)
                        </p>
                        <p className="text-sm text-zinc-500 mt-2">
                            Last Updated: November 27, 2025
                        </p>
                    </div>

                    <div className="space-y-12 text-zinc-300">
                        <section>
                            <p className="lead text-lg">
                                This Privacy Policy describes how Graphsense Solutions (acting as
                                the Service Provider, "we," "us," or "our") collects, uses, and
                                shares your Personal Information when you use the Tasks
                                Management System (TMS) via WhatsApp.
                            </p>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mt-4">
                                <p className="text-sm text-zinc-400 m-0">
                                    <strong>Note:</strong> The Tasks Management System is currently
                                    being developed for and tested internally by A2 Digital
                                    Solutions.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                1. The Controller of Your Data
                            </h2>
                            <p>The Service is provided by:</p>
                            <ul className="list-none pl-0 space-y-2 mt-4">
                                <li>
                                    <strong className="text-white">Company Name:</strong> Graphsense
                                    Solutions (Developer/Service Provider)
                                </li>
                                <li>
                                    <strong className="text-white">Address:</strong> A-602,
                                    Samrajya Pethkar Projects, Kothrud, Pune, India
                                </li>
                                <li>
                                    <strong className="text-white">
                                        Email for Privacy Concerns:
                                    </strong>{" "}
                                    <a
                                        href="mailto:info@graphsensesolutions.com"
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        info@graphsensesolutions.com
                                    </a>
                                </li>
                                <li>
                                    <strong className="text-white">Policy URL:</strong>{" "}
                                    <a
                                        href="https://a2tasks.vercel.app/policy"
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        https://a2tasks.vercel.app/policy
                                    </a>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                2. Information We Collect
                            </h2>
                            <p>
                                We only collect information necessary to provide and improve the
                                Tasks Management System.
                            </p>

                            <h3 className="text-xl font-medium text-white mt-6 mb-3">
                                A. Information You Provide to Us (via WhatsApp)
                            </h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong className="text-white">Contact Information:</strong>{" "}
                                    Your WhatsApp phone number, name, and profile picture (if
                                    available).
                                </li>
                                <li>
                                    <strong className="text-white">Conversation Content:</strong>{" "}
                                    The full text, images, or files you send to the Service (your
                                    task queries, reminders, and requests).
                                </li>
                                <li>
                                    <strong className="text-white">Opt-In/Consent:</strong>{" "}
                                    Records of your affirmative consent to receive proactive
                                    messages.
                                </li>
                            </ul>

                            <h3 className="text-xl font-medium text-white mt-6 mb-3">
                                B. Data Collected Automatically (through the WhatsApp API)
                            </h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong className="text-white">Metadata:</strong> Timestamps,
                                    message direction (inbound/outbound), message status, and
                                    Template identifiers.
                                </li>
                                <li>
                                    <strong className="text-white">Usage Data:</strong> Records of
                                    which tasks or automated features you utilize.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                3. How We Use Your Information
                            </h2>
                            <p>We use the collected information for the following purposes:</p>
                            <div className="overflow-x-auto mt-6">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-700">
                                            <th className="py-3 px-4 font-semibold text-white w-1/3">
                                                Purpose of Use
                                            </th>
                                            <th className="py-3 px-4 font-semibold text-white">
                                                Details
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        <tr>
                                            <td className="py-3 px-4 align-top text-zinc-300">
                                                Service Delivery (LLM Processing)
                                            </td>
                                            <td className="py-3 px-4 text-zinc-400">
                                                To process your task requests, generate LLM-powered
                                                responses, and facilitate task management.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 align-top text-zinc-300">
                                                Proactive Messaging
                                            </td>
                                            <td className="py-3 px-4 text-zinc-400">
                                                To send pre-approved Message Templates for task
                                                reminders and important system notices.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 align-top text-zinc-300">
                                                Service Improvement
                                            </td>
                                            <td className="py-3 px-4 text-zinc-400">
                                                To analyze conversation data to improve the accuracy and
                                                quality of the LLM responses and task automation
                                                features.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 align-top text-zinc-300">
                                                Compliance & Verification
                                            </td>
                                            <td className="py-3 px-4 text-zinc-400">
                                                To maintain records required by Meta's policies and
                                                applicable law.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                4. How We Share Your Information (Third-Party Disclosure)
                            </h2>
                            <p>
                                We share your information only to the extent necessary to
                                operate the Service.
                            </p>
                            <ul className="list-disc pl-5 space-y-4 mt-4">
                                <li>
                                    <strong className="text-white">Meta (Facebook, Inc.):</strong>{" "}
                                    We use the WhatsApp Business Platform, which is operated by
                                    Meta. Your messages and metadata are processed by Meta to
                                    facilitate communication.
                                </li>
                                <li>
                                    <strong className="text-white">
                                        Large Language Model (LLM) Provider:
                                    </strong>{" "}
                                    We transmit your conversation content to our LLM Provider to
                                    generate responses.
                                    <ul className="list-circle pl-5 mt-2 space-y-1 text-zinc-400">
                                        <li>
                                            <span className="text-zinc-300">Provider:</span> Groq,
                                            utilizing the GPT OSS 20B model.
                                        </li>
                                        <li>
                                            <span className="text-zinc-300">Data Usage Clause:</span>{" "}
                                            Your conversation data is processed by Groq solely for the
                                            purpose of generating our response to you and is not used
                                            to train or improve their public-facing models.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong className="text-white">
                                        Cloud Hosting & Backend:
                                    </strong>{" "}
                                    We use AWS (Amazon Web Services) and Vercel to host and manage
                                    our application backend and frontend. Both services are hosted
                                    in the US East 1 region.
                                    <div className="bg-zinc-900/50 border border-zinc-800 rounded p-3 mt-2 text-sm">
                                        <strong className="text-zinc-300">
                                            Note on Data Location:
                                        </strong>{" "}
                                        All application data is processed and stored on servers
                                        located in the United States (US East 1) for latency and
                                        performance reasons.
                                    </div>
                                </li>
                                <li>
                                    <strong className="text-white">Legal & Compliance:</strong> We
                                    may share information if legally required to do so by
                                    governmental or regulatory authorities.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                5. Data Retention
                            </h2>
                            <p>
                                We retain your Personal Information only for as long as
                                necessary.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li>
                                    <strong className="text-white">Conversation Content:</strong>{" "}
                                    Stored on our servers for 90 days for quality assurance and
                                    debugging, after which it is deleted or permanently
                                    anonymized.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                6. Your Data Rights
                            </h2>
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li>
                                    <strong className="text-white">Access:</strong> Request a copy
                                    of the Personal Information we hold about you.
                                </li>
                                <li>
                                    <strong className="text-white">Correction:</strong> Request
                                    correction of inaccurate or incomplete data.
                                </li>
                                <li>
                                    <strong className="text-white">
                                        Deletion (Right to be Forgotten):
                                    </strong>{" "}
                                    Request the permanent deletion of your Personal Information.
                                </li>
                                <li>
                                    <strong className="text-white">
                                        Opt-Out/Withdraw Consent:
                                    </strong>{" "}
                                    You can revoke your consent to receive proactive messages by
                                    sending the word "STOP" to our WhatsApp number.
                                </li>
                            </ul>
                            <p className="mt-4">
                                To exercise any of these rights, please contact us at{" "}
                                <a
                                    href="mailto:info@graphsensesolutions.com"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    info@graphsensesolutions.com
                                </a>
                                .
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                7. Changes to This Privacy Policy
                            </h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will
                                notify you of any significant changes by posting the new policy
                                on this page and updating the "Last Updated" date at the top.
                            </p>
                        </section>
                    </div>
                </article>

                <footer className="mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
                    &copy; {new Date().getFullYear()} Graphsense Solutions. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
