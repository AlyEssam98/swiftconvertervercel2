import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
}

const contentDirectory = path.join(process.cwd(), 'content/blog');

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) return [];
  
  const fileNames = fs.readdirSync(contentDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const matterResult = matter(fileContents);
      
      return {
        slug,
        content: matterResult.content,
        title: matterResult.data.title,
        description: matterResult.data.description,
        date: matterResult.data.date,
        author: matterResult.data.author,
        readTime: matterResult.data.readTime,
      } as BlogPost;
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getBlogPost(slug: string): BlogPost | undefined {
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return undefined;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  return {
    slug,
    content: matterResult.content,
    title: matterResult.data.title,
    description: matterResult.data.description,
    date: matterResult.data.date,
    author: matterResult.data.author,
    readTime: matterResult.data.readTime,
  } as BlogPost;
}
