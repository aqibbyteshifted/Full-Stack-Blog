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
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comments");
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        // Ensure we're working with an array
        const commentsArray = Array.isArray(data) ? data : [];
        setComments(commentsArray);
      } catch (error) {
        console.error('Error fetching comments:', error);
        // Optionally set an error state to show to the user
      }
    };

    fetchComments();
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