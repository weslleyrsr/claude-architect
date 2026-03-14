import Anthropic from "@anthropic-ai/sdk"

const fileManagementTools: Anthropic.Tool[] = [
  {
    name: "list_files",
    description:
      "List files in a directory. Returns filenames with sizes and modification dates. Use pattern parameter to filter by extension (e.g., '*.ts'). For reading a specific file's contents, use read_file instead.",
    input_schema: {
      type: "object" as const,
      properties: {
        directory: {
          type: "string",
          description: "Absolute or relative path to the directory to list",
        },
        pattern: {
          type: "string",
          description: "Optional glob pattern to filter results, e.g. '*.ts' or 'src/**'",
        },
      },
      required: ["directory"],
    },
  },
  {
    name: "read_file",
    description:
      "Read and return the full text contents of a file. Use for text files only — binary files will return garbled output. For large files (>1MB), consider using list_files first to check size.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Absolute or relative path to the file to read",
        },
        encoding: {
          type: "string",
          enum: ["utf8", "ascii", "base64"],
          description: "File encoding. Defaults to utf8 for text files.",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "write_file",
    description:
      "Write text content to a file, creating it if it does not exist or overwriting it if it does. Overwriting is NOT reversible without a backup. For appending without overwriting, see append_file.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Absolute or relative path to write to",
        },
        content: {
          type: "string",
          description: "Text content to write to the file",
        },
        create_dirs: {
          type: "boolean",
          description: "If true, create parent directories if they do not exist. Default: false.",
        },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "delete_file",
    description:
      "IRREVERSIBLE: Permanently delete a file from the filesystem. This action cannot be undone. Do NOT call this without explicit user confirmation that the file should be deleted. For moving a file instead, use move_file.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Absolute or relative path to the file to permanently delete",
        },
        confirmed: {
          type: "boolean",
          description: "Must be set to true to confirm the irreversible deletion",
        },
      },
      required: ["path", "confirmed"],
    },
  },
]

console.log("Tools defined:", fileManagementTools.map((t) => t.name))
