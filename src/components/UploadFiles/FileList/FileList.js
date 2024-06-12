
import React from 'react'
import FileItem from '../FileItem/FileItem'

const FileList = ({ files, removeFile }) => {
    console.log(files)
    const deleteFileHandler = (_name) => {
        removeFile(_name)
    }
    return (
        <ul className="file-list">
            {
                files &&
                files.map((f, index) => (<FileItem
                    key={f.id || index}
                    index={index}
                    file={f}
                    deleteFile={deleteFileHandler} />))
            }
        </ul>
    )
}

export default FileList
