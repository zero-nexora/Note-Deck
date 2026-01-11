// import { useState, useEffect } from "react";
// import { Paperclip, Plus, X, Download, Trash2, File } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useAttachment } from "@/hooks/use-attachment";
// import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
// import {
//   AttachmentInput,
//   ImageAttachmentPicker,
// } from "../common/image-attachment-picker";
// import { useBoardRealtime } from "@/hooks/use-board-realtime";

// interface BoardCardItemAttachmentsProps {
//   cardId: string;
//   attachments: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["attachments"];
//   realtimeUtils: ReturnType<typeof useBoardRealtime>;
// }

// export const BoardCardItemAttachments = ({
//   cardId,
//   attachments: initialAttachments = [],
//   realtimeUtils,
// }: BoardCardItemAttachmentsProps) => {
//   const [attachments, setAttachments] = useState(initialAttachments);
//   const [isAdding, setIsAdding] = useState(false);

//   const { uploadAttachment, deleteAttachment } = useAttachment();

//   useEffect(() => {
//     setAttachments(initialAttachments);
//   }, [initialAttachments]);

//   const handleAddAttachment = async (attachmentInput: AttachmentInput) => {
//     const newAttachment = await uploadAttachment({
//       cardId,
//       ...attachmentInput,
//       expiresAt: undefined,
//     });

//     if (newAttachment) {
//       // setAttachments((prev) => [...prev, { ...newAttachment, user: null },]);

//       realtimeUtils.broadcastCardUpdated({
//         cardId,
//         field: "coverImage",
//         value: "attachment_added",
//       });
//     }

//     setIsAdding(false);
//   };

//   const handleDeleteAttachment = async (id: string) => {
//     await deleteAttachment({ id });
//     setAttachments((prev) => prev.filter((a) => a.id !== id));

//     realtimeUtils.broadcastCardUpdated({
//       cardId,
//       field: "coverImage",
//       value: "attachment_deleted",
//     });
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return "0 B";
//     const k = 1024;
//     const sizes = ["B", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
//   };

//   const getFileIcon = (fileType: string) => {
//     if (fileType.startsWith("image/")) return null;
//     return <File className="h-8 w-8 text-muted-foreground" />;
//   };

//   return (
//     <Card className="overflow-hidden bg-card border-border">
//       <div className="flex items-center justify-between p-4 border-b border-border">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
//             <Paperclip className="h-5 w-5 text-primary" />
//           </div>
//           <h3 className="text-base font-semibold text-foreground">
//             Attachments
//           </h3>
//           {attachments.length > 0 && (
//             <Badge
//               variant="secondary"
//               className="bg-secondary text-secondary-foreground"
//             >
//               {attachments.length}
//             </Badge>
//           )}
//         </div>
//         <Button
//           size="sm"
//           variant="ghost"
//           onClick={() => setIsAdding(!isAdding)}
//           className="text-muted-foreground hover:text-foreground hover:bg-accent"
//         >
//           {isAdding ? (
//             <>
//               <X className="h-4 w-4 mr-2" />
//               Cancel
//             </>
//           ) : (
//             <>
//               <Plus className="h-4 w-4 mr-2" />
//               Add
//             </>
//           )}
//         </Button>
//       </div>

//       {isAdding && (
//         <div className="p-4 bg-muted/30">
//           <ImageAttachmentPicker
//             onSelect={handleAddAttachment}
//             disabled={false}
//           />
//         </div>
//       )}

//       {attachments.length > 0 && (
//         <div className="p-4 space-y-3">
//           {attachments.map((attachment) => {
//             // const isImage = attachment.fileType.startsWith("image/");

//             return (
//               <div
//                 key={attachment.id}
//                 className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
//               >
//                 {/* <div className="shrink-0">
//                   {isImage ? (
//                     <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
//                       <Image
//                         src={attachment.fileUrl}
//                         alt={attachment.fileName}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
//                       {getFileIcon(attachment.fileType)}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium text-foreground truncate mb-1">
//                     {attachment.fileName}
//                   </p>
//                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                     <span>{formatFileSize(attachment.fileSize)}</span>
//                     <span>•</span>
//                     <span className="uppercase">
//                       {attachment.fileType.split("/")[1] || "file"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => window.open(attachment.fileUrl, "_blank")}
//                     title="Download"
//                     className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
//                   >
//                     <Download className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => handleDeleteAttachment(attachment.id)}
//                     title="Delete"
//                     className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div> */}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {attachments.length === 0 && !isAdding && (
//         <div className="flex flex-col items-center justify-center py-12 text-center px-4">
//           <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
//             <Paperclip className="h-8 w-8 text-muted-foreground" />
//           </div>
//           <p className="font-medium text-foreground mb-1">No attachments yet</p>
//           <p className="text-sm text-muted-foreground">
//             Click &quot;Add&quot; to upload files
//           </p>
//         </div>
//       )}
//     </Card>
//   );
// };
