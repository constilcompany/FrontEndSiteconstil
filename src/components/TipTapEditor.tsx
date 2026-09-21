import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import ResizeImage from 'tiptap-extension-resize-image';
import { 
    Bold, Italic, Underline as UnderlineIcon, 
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, 
    ImageIcon, Undo, Redo, 
    Quote, Link as LinkIcon, Unlink 
} from 'lucide-react';
import { useCallback } from 'react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

export const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt('Image URL (or drag & drop local images directly into the editor)');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const toggleColor = () => {
        const color = window.prompt('Enter hex color (e.g. #ff0000) or name:');
        if (color) {
            editor.chain().focus().setColor(color).run();
        } else {
            editor.chain().focus().unsetColor().run();
        }
    };

    const ToolbarButton = ({ onClick, isActive, disabled, children, title }: any) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${isActive ? 'bg-slate-200 text-primary' : 'text-slate-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className="sticky top-0 z-10 flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-lg items-center">
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={18} /></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={18} /></ToolbarButton>
            
            <div className="w-px h-6 bg-slate-300 mx-1"></div>

            <select
                className="mx-1 border border-slate-300 rounded p-1.5 text-sm bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                onChange={(e) => {
                    const level = e.target.value;
                    if (level === 'p') {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor.chain().focus().setHeading({ level: parseInt(level) }).run();
                    }
                }}
                value={
                    editor.isActive('heading', { level: 1 }) ? '1' :
                    editor.isActive('heading', { level: 2 }) ? '2' :
                    editor.isActive('heading', { level: 3 }) ? '3' :
                    editor.isActive('heading', { level: 4 }) ? '4' :
                    editor.isActive('heading', { level: 5 }) ? '5' :
                    editor.isActive('heading', { level: 6 }) ? '6' : 'p'
                }
            >
                <option value="p">Normal Text</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
                <option value="4">Heading 4</option>
                <option value="5">Heading 5</option>
                <option value="6">Heading 6</option>
            </select>
            <div className="w-px h-6 bg-slate-300 mx-1"></div>

            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold"><Bold size={18} /></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic"><Italic size={18} /></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline"><UnderlineIcon size={18} /></ToolbarButton>
            
            <div className="w-px h-6 bg-slate-300 mx-1"></div>

            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List"><List size={18} /></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List"><ListOrdered size={18} /></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote"><Quote size={18} /></ToolbarButton>

            <div className="w-px h-6 bg-slate-300 mx-1"></div>

            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft size={18} /></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter size={18} /></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight size={18} /></ToolbarButton>

            <div className="w-px h-6 bg-slate-300 mx-1"></div>

            <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link"><LinkIcon size={18} /></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} title="Unlink"><Unlink size={18} /></ToolbarButton>
            <ToolbarButton onClick={addImage} title="Image"><ImageIcon size={18} /></ToolbarButton>
            
            <button
                type="button"
                onClick={toggleColor}
                title="Text Color"
                className="w-6 h-6 rounded-full border border-slate-300 ml-1"
                style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
            />

            <select
                className="ml-2 border border-slate-300 rounded p-1.5 text-sm bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                onChange={(e) => {
                    const size = e.target.value;
                    if (size) {
                        editor.chain().focus().setFontSize(size).run();
                    } else {
                        editor.chain().focus().unsetFontSize().run();
                    }
                }}
                value={editor.getAttributes('textStyle').fontSize || ''}
            >
                <option value="">Font Size (Default)</option>
                <option value="12px">12px - Small</option>
                <option value="14px">14px</option>
                <option value="16px">16px - Normal</option>
                <option value="18px">18px</option>
                <option value="20px">20px - Large</option>
                <option value="24px">24px - Huge</option>
                <option value="32px">32px - Giant</option>
            </select>
        </div>
    );
};

export const TipTapEditor = ({ content, onChange }: { content: string, onChange: (content: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            FontSize,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline hover:text-primary-hover transition-colors',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            ResizeImage.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6 text-slate-800 [&_ul]:list-disc [&_ol]:list-decimal [&_li_p]:m-0',
            },
            handleDrop: function(view, event, slice, moved) {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    let file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        let reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => {
                            let src = reader.result as string;
                            const { schema } = view.state;
                            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                            if (coordinates) {
                                const node = schema.nodes.image.create({ src });
                                const transaction = view.state.tr.insert(coordinates.pos, node);
                                view.dispatch(transaction);
                            }
                        };
                        return true;
                    }
                }
                return false;
            }
        },
    });

    return (
        <div className="border border-border rounded-lg bg-white flex flex-col shadow-sm">
            <MenuBar editor={editor} />
            <div className="bg-white flex-grow cursor-text blog-content-body" onClick={() => editor?.commands.focus()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};
