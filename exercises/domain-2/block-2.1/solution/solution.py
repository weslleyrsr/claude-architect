file_management_tools = [
    {
        "name": "list_files",
        "description": (
            "List files in a directory. Returns filenames with sizes and modification dates. "
            "Use pattern parameter to filter by extension (e.g., '*.py'). "
            "For reading a specific file's contents, use read_file instead."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "directory": {
                    "type": "string",
                    "description": "Absolute or relative path to the directory to list",
                },
                "pattern": {
                    "type": "string",
                    "description": "Optional glob pattern to filter results, e.g. '*.py'",
                },
            },
            "required": ["directory"],
        },
    },
    {
        "name": "read_file",
        "description": (
            "Read and return the full text contents of a file. "
            "Use for text files only — binary files will return garbled output. "
            "For large files (>1MB), check size with list_files first."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Absolute or relative path to the file to read",
                },
                "encoding": {
                    "type": "string",
                    "enum": ["utf-8", "ascii", "base64"],
                    "description": "File encoding. Defaults to utf-8 for text files.",
                },
            },
            "required": ["path"],
        },
    },
    {
        "name": "write_file",
        "description": (
            "Write text content to a file, creating it if not exists or overwriting if it does. "
            "Overwriting is NOT reversible without a backup. "
            "For appending without overwriting, use append_file."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Absolute or relative path to write to",
                },
                "content": {
                    "type": "string",
                    "description": "Text content to write to the file",
                },
                "create_dirs": {
                    "type": "boolean",
                    "description": "If true, create parent directories if they do not exist. Default: false.",
                },
            },
            "required": ["path", "content"],
        },
    },
    {
        "name": "delete_file",
        "description": (
            "IRREVERSIBLE: Permanently delete a file from the filesystem. "
            "This action cannot be undone. "
            "Do NOT call without explicit user confirmation. "
            "For moving a file instead, use move_file."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Absolute or relative path to the file to permanently delete",
                },
                "confirmed": {
                    "type": "boolean",
                    "description": "Must be true to confirm the irreversible deletion",
                },
            },
            "required": ["path", "confirmed"],
        },
    },
]

print("Tools defined:", [t["name"] for t in file_management_tools])
