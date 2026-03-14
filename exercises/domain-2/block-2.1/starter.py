# TODO: Define 4 tools with production-quality descriptions and schemas
# 1. list_files — list files in a directory (with optional filter)
# 2. read_file — read file contents
# 3. write_file — create or overwrite a file
# 4. delete_file — IRREVERSIBLE permanent delete

file_management_tools = [
    {
        "name": "list_files",
        "description": "TODO: Write a meaningful description",
        "input_schema": {
            "type": "object",
            "properties": {
                "directory": {
                    "type": "string",
                    "description": "TODO",
                },
                # TODO: Add optional filter parameter
            },
            "required": ["directory"],
        },
    },
    # TODO: Add read_file, write_file, delete_file
]

print("Tools defined:", [t["name"] for t in file_management_tools])
