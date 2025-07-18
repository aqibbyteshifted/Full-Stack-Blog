"use client";
import React, { useEffect, useState } from "react";

type Comment = {
  id: string;
  blog?: { title?: string };
  name: string;
  content: string;
  createdAt: string;
  status: string;
};

export default function CommentsTab() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then(setComments);
  }, []);

interface ApprovePayload {
    status: string;
}

const handleApprove: (id: string) => Promise<void> = async (id: string): Promise<void> => {
    const payload: ApprovePayload = { status: "Approved" };
    await fetch(`/api/comments?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    setComments(comments.map((c: Comment) => (c.id === id ? { ...c, status: "Approved" } : c)));
};

const handleDelete: (id: string) => Promise<void> = async (id: string): Promise<void> => {
    await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
    setComments(comments.filter((c: Comment) => c.id !== id));
};

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Blog Title & Comment</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((c) => (
          <tr key={c.id}>
            <td>
              <div>Blog: {c.blog?.title}</div>
              <div>Name: {c.name}</div>
              <div>Comment: {c.content}</div>
            </td>
            <td>{new Date(c.createdAt).toLocaleDateString()}</td>
            <td>
              <button onClick={() => handleApprove(c.id)} className="border px-2 py-1 mr-2">Approve</button>
              <button onClick={() => handleDelete(c.id)} className="border px-2 py-1 text-red-600">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}