"use client";
import { useFiles } from "@/lib/hooks/useFiles";
import { FileJson, FileText, Share2, Clock } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

export default function FilesPage() {
  const { data: files, isLoading } = useFiles();
  const [sharingId, setSharingId] = useState<number | null>(null);
  const [shareInput, setShareInput] = useState("");

  const handleShare = async (fileId: number) => {
    const ids = shareInput
      .split(",")
      .map((s) => Number(s.trim()))
      .filter(Boolean);
    await api.post(`/files/${fileId}/share/`, { user_ids: ids });
    setSharingId(null);
    setShareInput("");
  };

  if (isLoading) return <div className="text-sm text-gray-400">Loading…</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Exported files
      </h1>
      <div className="grid gap-3">
        {files?.map((file) => (
          <div
            key={file.id}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {file.format === "json" ? (
                  <FileJson size={20} className="text-blue-500 shrink-0" />
                ) : (
                  <FileText size={20} className="text-green-500 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Batch #{file.batch_job} — {file.source_meta.table}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {file.source_meta.connection} · {file.source_meta.db_type}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-300 mt-1">
                    <Clock size={11} />
                    {new Date(file.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={file.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Download
                </a>
                <button
                  onClick={() =>
                    setSharingId(sharingId === file.id ? null : file.id)
                  }
                  className="flex items-center gap-1 text-xs text-blue-600 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Share2 size={11} /> Share
                </button>
              </div>
            </div>

            {sharingId === file.id && (
              <div className="mt-3 flex gap-2 items-center">
                <input
                  value={shareInput}
                  onChange={(e) => setShareInput(e.target.value)}
                  placeholder="User IDs comma-separated: 2, 5, 8"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => handleShare(file.id)}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Share
                </button>
              </div>
            )}
          </div>
        ))}
        {files?.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-12">
            No files yet — submit a batch to generate exports.
          </p>
        )}
      </div>
    </div>
  );
}
