import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'
import services from '../appwrite/config'

function RTX({name,control,defaultValue='' ,label}) {

  return (
    <div className='w-full'>
      {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

      <Controller
      name={name || 'control'}
      control={control}
      render ={({ field: { onChange } }) => (
        <Editor
          apiKey='f2cflz2jnd1zmpzjrkodg1oqorak04cc33v2o69y5008jqsp'
          initialValue={defaultValue}
          init={{
            initialValue: defaultValue,
            height: 700,
            min_height: 600,
            resize: true,
            toolbar_sticky: true,
            menubar: 'file edit view insert format tools table help',
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'wordcount',
              'emoticons',
              'codesample',
              'autosave',
              'quickbars',
            ],
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | codesample emoticons | removeformat | preview fullscreen',
            quickbars_selection_toolbar:
              'bold italic | quicklink h2 h3 blockquote | forecolor backcolor',
            quickbars_insert_toolbar: 'image media table codesample hr',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            // Image upload to Appwrite Storage
            automatic_uploads: true,
            file_picker_types: 'image',
            images_upload_handler: async (blobInfo, progress) => {
              try {
                const blob = blobInfo.blob();
                const uploaded = await services.uploadFile(blob);
                if (!uploaded || !uploaded.$id) throw new Error('Upload failed');
                const url = services.getPreview(uploaded.$id);
                if (!url) throw new Error('Could not resolve file URL');
                return url;
              } catch (err) {
                console.error('TinyMCE image upload error:', err);
                throw err;
              }
            },
            // Autosave settings
            autosave_ask_before_unload: true,
            autosave_interval: '20s',
            autosave_retention: '30m',
          }}
          onEditorChange={onChange}
        />
      )}

      />

    </div>
  )
}

export default RTX