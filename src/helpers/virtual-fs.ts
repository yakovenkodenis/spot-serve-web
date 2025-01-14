export class VirtualFS {
  files: Map<string, string>;

  resolvedFiles: Map<string, string>;

  constructor() {
    this.files = new Map<string, string>();
    this.resolvedFiles = new Map<string, string>();
  }

  addFile(path: string, content: string) {
    this.files.set(path, content);
  }

  getFile(path: string) {
    return this.files.get(path);
  }

  // Resolve relative paths to absolute
  resolvePath(basePath: string, relativePath: string) {
    if (relativePath.startsWith('/')) {
      return relativePath;
    }
    const stack = basePath.split('/');
    stack.pop(); // Remove filename
    const parts = relativePath.split('/');
    for (const part of parts) {
      if (part === '..') {
        stack.pop();
      } else if (part !== '.') {
        stack.push(part);
      }
    }
    return stack.join('/');
  }

  // Process imports in content
  processImports(content: string, filePath: string, type: string) {
    let processedContent = content;

    if (type === 'html') {
      // Handle <link> tags
      processedContent = processedContent.replace(/<link[^>]*href=["']([^"']+)["'][^>]*>/g, (match, href) => {
        const absolutePath = this.resolvePath(filePath, href);
        const resolvedContent = this.getFile(absolutePath);
        if (resolvedContent) {
          return `<style>${this.processImports(resolvedContent, absolutePath, 'css')}</style>`;
        }
        return match;
      });

      // Handle <script> tags
      processedContent = processedContent.replace(/<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/g, (match, src) => {
        const absolutePath = this.resolvePath(filePath, src);
        const resolvedContent = this.getFile(absolutePath);
        if (resolvedContent) {
          return `<script>${this.processImports(resolvedContent, absolutePath, 'js')}</script>`;
        }
        return match;
      });
    } else if (type === 'css') {
      // Handle @import rules
      processedContent = processedContent.replace(/@import\s+["']([^"']+)["']/g, (match, importPath) => {
        const absolutePath = this.resolvePath(filePath, importPath);
        const resolvedContent = this.getFile(absolutePath);
        if (resolvedContent) {
          return this.processImports(resolvedContent, absolutePath, 'css');
        }
        return match;
      });
    } else if (type === 'js') {
      // Handle import statements (basic support)
      processedContent = processedContent.replace(/import\s+.*?from\s+["']([^"']+)["']/g, (match, importPath) => {
        const absolutePath = this.resolvePath(filePath, importPath);
        const resolvedContent = this.getFile(absolutePath);
        if (resolvedContent) {
          return `// Inlined import from ${importPath}\n${this.processImports(resolvedContent, absolutePath, 'js')}`;
        }
        return match;
      });
    }

    return processedContent;
  }
}
