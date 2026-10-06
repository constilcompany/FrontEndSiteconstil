import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import ResizeImage from 'tiptap-extension-resize-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
    Bold, Italic, Underline as UnderlineIcon, 
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, 
    ImageIcon, Undo, Redo, 
    Quote, Link as LinkIcon, Unlink 
} from 'lucide-react';
import { useCallback, useEffect } from 'react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

const CustomTable = Table.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            style: {
                default: null,
                parseHTML: element => element.getAttribute('style'),
                renderHTML: attributes => {
                    if (!attributes.style) {
                        return {};
                    }
                    return {
                        style: attributes.style,
                    };
                },
            },
        };
    },
});

const CustomTableRow = TableRow.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            style: {
                default: null,
                parseHTML: element => element.getAttribute('style'),
                renderHTML: attributes => {
                    if (!attributes.style) {
                        return {};
                    }
                    return {
                        style: attributes.style,
                    };
                },
            },
        };
    },
});

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
            CustomTable.configure({
                resizable: true,
                handleWidth: 5,
                cellMinWidth: 50,
                lastColumnResizable: true,
                HTMLAttributes: {
                    class: 'border-collapse border border-slate-300 my-4',
                },
            }),
            CustomTableRow.configure({
                HTMLAttributes: {
                    class: 'border-b border-slate-300',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-slate-300 p-2 bg-slate-100 font-bold text-left',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-slate-300 p-2',
                },
            }),
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
            handlePaste: function(view, event, slice) {
                const items = event.clipboardData?.items;
                if (!items) return false;

                // Check for Word's blocked local file images
                const html = event.clipboardData?.getData('text/html');
                if (html && html.includes('src="file:///')) {
                    alert('Browser Security Warning:\n\nMicrosoft Word tried to paste an image using a local computer path (file:///) which web browsers block for security.\n\nTo paste this image, please do one of the following:\n1. Take a screenshot of the image and paste the screenshot.\n2. Right-click the image in Word, click "Save as Picture...", then drag and drop the saved file here.');
                    // Don't return true, let the text parts paste, just the image will be broken as usual but now they know why.
                }

                let imageHandled = false;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.type.indexOf('image') === 0) {
                        event.preventDefault();
                        imageHandled = true;
                        const file = item.getAsFile();
                        if (file) {
                            import('browser-image-compression').then((module) => {
                                const imageCompression = module.default;
                                return imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true });
                            }).then(compressedFile => {
                                const reader = new FileReader();
                                reader.readAsDataURL(compressedFile);
                                reader.onload = () => {
                                    const src = reader.result as string;
                                    const { schema } = view.state;
                                    const imageNode = schema.nodes.imageResize || schema.nodes.image;
                                    if (imageNode) {
                                        const node = imageNode.create({ src });
                                        const transaction = view.state.tr.replaceSelectionWith(node);
                                        view.dispatch(transaction);
                                    }
                                };
                            }).catch(err => {
                                console.error('Image compression error:', err);
                            });
                        }
                    }
                }
                return imageHandled;
            },
            handleDrop: function(view, event, slice, moved) {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    let file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        import('browser-image-compression').then((module) => {
                            const imageCompression = module.default;
                            return imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true });
                        }).then(compressedFile => {
                            let reader = new FileReader();
                            reader.readAsDataURL(compressedFile);
                            reader.onload = () => {
                                let src = reader.result as string;
                                const { schema } = view.state;
                                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                                if (coordinates) {
                                    const imageNode = schema.nodes.imageResize || schema.nodes.image;
                                    if (imageNode) {
                                        const node = imageNode.create({ src });
                                        const transaction = view.state.tr.insert(coordinates.pos, node);
                                        view.dispatch(transaction);
                                    }
                                }
                            };
                        }).catch(err => {
                            console.error('Image drop compression error:', err);
                        });
                        return true;
                    }
                }
                return false;
            }
        },
    });

    useEffect(() => {
        if (!editor) return;

        const container = document.querySelector('.blog-content-body') as HTMLElement;
        if (!container) return;

        let isResizing = false;
        let isTableCornerResizing = false;
        let startY = 0;
        let startX = 0;
        let startHeight = 0;
        let startTableWidth = 0;
        let startColWidths: number[] = [];
        let resizeRow: HTMLTableRowElement | null = null;
        let resizeTable: HTMLTableElement | null = null;
        let resizeNodePos: number | null = null;
        let resizeTableNodePos: number | null = null;
        let resizeHandleLine: HTMLDivElement | null = null;
        let currentHoverTable: HTMLTableElement | null = null;
        let tableCornerHandle: HTMLDivElement | null = null;

        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (target.classList.contains('table-corner-resize-handle')) {
                isTableCornerResizing = true;
                startY = e.clientY;
                startX = e.clientX;
                resizeTable = target.closest('table');
                if (resizeTable) {
                    startHeight = resizeTable.getBoundingClientRect().height;
                    startTableWidth = resizeTable.getBoundingClientRect().width;
                    
                    startColWidths = [];
                    const cols = resizeTable.querySelectorAll('col');
                    cols.forEach(col => {
                        const w = parseFloat(col.style.width || col.getAttribute('width') || '0');
                        startColWidths.push(w);
                    });
                    
                    const view = editor.view;
                    try {
                        const pos = view.posAtDOM(resizeTable, 0);
                        resizeTableNodePos = pos > 0 ? pos - 1 : null;
                    } catch (err) {
                        resizeTableNodePos = null;
                    }
                }
                e.preventDefault();
                return;
            }
            const cell = target.closest('td, th');
            if (cell) {
                const rect = cell.getBoundingClientRect();
                // Check if near bottom border
                if (rect.bottom - e.clientY <= 5 && rect.bottom - e.clientY >= -1) {
                    isResizing = true;
                    startY = e.clientY;
                    resizeRow = cell.parentElement as HTMLTableRowElement;
                    startHeight = resizeRow.getBoundingClientRect().height;
                    
                    const view = editor.view;
                    try {
                        const pos = view.posAtDOM(resizeRow, 0);
                        resizeNodePos = pos > 0 ? pos - 1 : null;
                    } catch (err) {
                        resizeNodePos = null;
                    }

                    const table = resizeRow.closest('table');
                    if (table) {
                        table.style.position = 'relative';
                        resizeHandleLine = document.createElement('div');
                        resizeHandleLine.style.position = 'absolute';
                        resizeHandleLine.style.left = '-2px';
                        resizeHandleLine.style.right = '-2px';
                        resizeHandleLine.style.height = '4px';
                        resizeHandleLine.style.backgroundColor = '#3b82f6';
                        resizeHandleLine.style.pointerEvents = 'none';
                        resizeHandleLine.style.zIndex = '50';
                        table.appendChild(resizeHandleLine);

                        const tableRect = table.getBoundingClientRect();
                        const rowRect = resizeRow.getBoundingClientRect();
                        const initialTopOffset = rowRect.bottom - tableRect.top;
                        
                        resizeHandleLine.style.top = `${initialTopOffset - 2}px`;

                        const updateLinePosition = (diffY: number) => {
                            if (!resizeHandleLine) return;
                            const maxDiff = 24 - startHeight;
                            const effectiveDiff = Math.max(diffY, maxDiff);
                            resizeHandleLine.style.top = `${initialTopOffset - 2 + effectiveDiff}px`;
                        };
                        (resizeHandleLine as any).updatePosition = updateLinePosition;
                    }

                    e.preventDefault();
                }
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isTableCornerResizing && resizeTable) {
                const diffX = e.clientX - startX;
                const diffY = e.clientY - startY;
                const newWidth = Math.max(150, startTableWidth + diffX);
                const newHeight = Math.max(50, startHeight + diffY);
                const scaleX = newWidth / startTableWidth;

                resizeTable.style.width = `${newWidth}px`;
                resizeTable.style.height = `${newHeight}px`;

                const cols = resizeTable.querySelectorAll('col');
                cols.forEach((col, idx) => {
                    if (startColWidths[idx]) {
                        col.style.width = `${Math.max(25, startColWidths[idx] * scaleX)}px`;
                    }
                });

                document.body.style.userSelect = 'none';
                return;
            }

            if (isResizing && resizeRow) {
                const diffY = e.clientY - startY;
                document.body.style.userSelect = 'none';
                if (resizeHandleLine && (resizeHandleLine as any).updatePosition) {
                    (resizeHandleLine as any).updatePosition(diffY);
                }
            } else {
                const target = e.target as HTMLElement;
                const cell = target.closest('td, th') as HTMLElement;
                if (cell) {
                    const rect = cell.getBoundingClientRect();
                    const isNearRight = rect.right - e.clientX <= 5;
                    
                    if (rect.bottom - e.clientY <= 5 && rect.bottom - e.clientY >= -1 && !isNearRight) {
                        cell.style.cursor = 'row-resize';
                    } else if (cell.style.cursor === 'row-resize') {
                        cell.style.cursor = '';
                    }
                }
                
                const table = target.closest('table');
                if (table && table !== currentHoverTable && !isTableCornerResizing && !isResizing) {
                    if (tableCornerHandle) tableCornerHandle.remove();
                    currentHoverTable = table;
                    table.style.position = 'relative';
                    
                    tableCornerHandle = document.createElement('div');
                    tableCornerHandle.className = 'table-corner-resize-handle';
                    tableCornerHandle.style.position = 'absolute';
                    tableCornerHandle.style.bottom = '-6px';
                    tableCornerHandle.style.right = '-6px';
                    tableCornerHandle.style.width = '12px';
                    tableCornerHandle.style.height = '12px';
                    tableCornerHandle.style.backgroundColor = '#3b82f6';
                    tableCornerHandle.style.border = '2px solid white';
                    tableCornerHandle.style.cursor = 'nwse-resize';
                    tableCornerHandle.style.zIndex = '60';
                    table.appendChild(tableCornerHandle);
                } else if (!table && currentHoverTable && !isTableCornerResizing && !isResizing) {
                    if (!target.classList.contains('table-corner-resize-handle')) {
                        if (tableCornerHandle) tableCornerHandle.remove();
                        tableCornerHandle = null;
                        currentHoverTable = null;
                    }
                }
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (isTableCornerResizing && resizeTable && resizeTableNodePos !== null) {
                const diffX = e.clientX - startX;
                const diffY = e.clientY - startY;
                const newWidth = Math.max(150, startTableWidth + diffX);
                const newHeight = Math.max(50, startHeight + diffY);
                const scaleX = newWidth / startTableWidth;
                
                resizeTable.style.width = `${newWidth}px`;
                resizeTable.style.height = `${newHeight}px`;

                const { state, dispatch } = editor.view;
                let tr = state.tr;
                
                const tableNode = state.doc.nodeAt(resizeTableNodePos);
                if (tableNode && tableNode.type.name === 'table') {
                    const existingStyle = tableNode.attrs.style || '';
                    const styleMap = new Map();
                    existingStyle.split(';').forEach((s: string) => {
                        const [k, v] = s.split(':');
                        if (k && v) styleMap.set(k.trim(), v.trim());
                    });
                    styleMap.set('width', `${newWidth}px`);
                    styleMap.set('height', `${newHeight}px`);
                    
                    const newStyle = Array.from(styleMap.entries()).map(([k, v]) => `${k}: ${v}`).join('; ');
                    
                    tr = tr.setNodeMarkup(resizeTableNodePos, undefined, {
                        ...tableNode.attrs,
                        style: newStyle
                    });

                    // Update colwidths for cells
                    tableNode.descendants((node, pos) => {
                        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
                            if (node.attrs.colwidth) {
                                const newColwidths = node.attrs.colwidth.map((w: number) => Math.max(25, Math.round(w * scaleX)));
                                tr = tr.setNodeMarkup(resizeTableNodePos! + 1 + pos, undefined, {
                                    ...node.attrs,
                                    colwidth: newColwidths
                                });
                            }
                        }
                    });
                    
                    dispatch(tr);
                }
                
                isTableCornerResizing = false;
                resizeTable = null;
                resizeTableNodePos = null;
                document.body.style.userSelect = '';
                return;
            }

            if (isResizing) {
                if (resizeRow && resizeNodePos !== null) {
                    const diffY = e.clientY - startY;
                    const newHeight = Math.max(24, startHeight + diffY);
                    
                    resizeRow.style.height = `${newHeight}px`;

                    const { state, dispatch } = editor.view;
                    const node = state.doc.nodeAt(resizeNodePos);
                    if (node && node.type.name === 'tableRow') {
                        const tr = state.tr.setNodeMarkup(resizeNodePos, undefined, {
                            ...node.attrs,
                            style: `height: ${newHeight}px`
                        });
                        dispatch(tr);
                    }
                }
                isResizing = false;
                resizeRow = null;
                resizeNodePos = null;
                if (resizeHandleLine) {
                    resizeHandleLine.remove();
                    resizeHandleLine = null;
                }
                document.body.style.userSelect = '';
            }
        };

        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
        };
    }, [editor]);

    return (
        <div className="border border-border rounded-lg bg-white flex flex-col shadow-sm">
            <MenuBar editor={editor} />
            <div className="bg-white flex-grow cursor-text blog-content-body" onClick={() => editor?.commands.focus()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};
