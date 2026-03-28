import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return NextResponse.json({ error: "No repo URL provided" }, { status: 400 });
    }

    // Parse GitHub URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, "");
    const token = process.env.GITHUB_TOKEN;

    const headers = {
      Accept: "application/vnd.github.v3+json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Fetch repo tree
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/main?recursive=1`,
      { headers }
    );

    let treeData;
    if (!treeRes.ok) {
      // Try 'master' branch
      const masterRes = await fetch(
        `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/master?recursive=1`,
        { headers }
      );
      if (!masterRes.ok) {
        return NextResponse.json(
          { error: "Could not fetch repository. Check URL and permissions." },
          { status: 404 }
        );
      }
      treeData = await masterRes.json();
    } else {
      treeData = await treeRes.json();
    }

    // Filter code files
    const codeExtensions = [
      ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".c", ".cpp", ".cs",
      ".go", ".rs", ".php", ".rb", ".swift", ".kt", ".html", ".css",
      ".sql", ".sh", ".json", ".yml", ".yaml", ".md", ".vue", ".svelte",
    ];

    const files = (treeData.tree || [])
      .filter((item) => {
        if (item.type !== "blob") return false;
        const ext = "." + item.path.split(".").pop().toLowerCase();
        return codeExtensions.includes(ext);
      })
      .slice(0, 100) // Limit files
      .map((item) => ({
        path: item.path,
        sha: item.sha,
        size: item.size,
        type: "file",
      }));

    return NextResponse.json({
      owner,
      repo: cleanRepo,
      files,
      totalFiles: files.length,
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Fetch file content
export async function PUT(request) {
  try {
    const { owner, repo, path } = await request.json();

    const token = process.env.GITHUB_TOKEN;
    const headers = { Accept: "application/vnd.github.v3+json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Could not fetch file" }, { status: 404 });
    }

    const data = await res.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");

    return NextResponse.json({ content, path });
  } catch (error) {
    console.error("GitHub file fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
