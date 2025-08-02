import os
import subprocess
from datetime import datetime
from pathlib import Path
from typing import List, Optional
from git import Repo, GitCommandError
from config import GIT_COMMIT_MESSAGE_TEMPLATE, GIT_BRANCH


class GitManager:
    """Git自动化管理器"""
    
    def __init__(self, repo_path: str = '.'):
        self.repo_path = Path(repo_path)
        try:
            self.repo = Repo(self.repo_path)
        except Exception as e:
            print(f"Git仓库初始化失败: {e}")
            self.repo = None
    
    def is_git_repo(self) -> bool:
        """检查是否为Git仓库"""
        return self.repo is not None and not self.repo.bare
    
    def init_repo(self) -> bool:
        """初始化Git仓库"""
        try:
            if not self.is_git_repo():
                self.repo = Repo.init(self.repo_path)
                print("Git仓库初始化成功")
            return True
        except Exception as e:
            print(f"Git仓库初始化失败: {e}")
            return False
    
    def add_gitignore(self) -> bool:
        """添加.gitignore文件"""
        try:
            gitignore_content = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Environment variables
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Temporary files
*.tmp
*.temp

# Large files (optional - you might want to track images)
# *.jpg
# *.jpeg
# *.png
# *.gif
"""
            
            gitignore_path = self.repo_path / '.gitignore'
            with open(gitignore_path, 'w') as f:
                f.write(gitignore_content)
            
            print("已创建.gitignore文件")
            return True
            
        except Exception as e:
            print(f"创建.gitignore失败: {e}")
            return False
    
    def get_status(self) -> dict:
        """获取Git状态"""
        if not self.is_git_repo():
            return {}
        
        try:
            status = {
                'branch': self.repo.active_branch.name,
                'untracked_files': [item.a_path for item in self.repo.index.diff(None)],
                'modified_files': [item.a_path for item in self.repo.index.diff('HEAD')],
                'staged_files': [item.a_path for item in self.repo.index.diff('HEAD').iter_change_type('M')],
                'is_dirty': self.repo.is_dirty(),
                'commit_count': len(list(self.repo.iter_commits())),
                'last_commit': {
                    'hash': self.repo.head.commit.hexsha[:8],
                    'message': self.repo.head.commit.message.strip(),
                    'author': str(self.repo.head.commit.author),
                    'date': datetime.fromtimestamp(self.repo.head.commit.committed_date).isoformat()
                } if self.repo.head.commit else None
            }
            return status
        except Exception as e:
            print(f"获取Git状态失败: {e}")
            return {}
    
    def add_files(self, file_patterns: List[str] = None) -> bool:
        """添加文件到暂存区"""
        if not self.is_git_repo():
            return False
        
        try:
            if file_patterns is None:
                # 添加所有文件
                self.repo.git.add(A=True)
                print("已添加所有文件到暂存区")
            else:
                # 添加指定文件
                for pattern in file_patterns:
                    self.repo.git.add(pattern)
                print(f"已添加文件到暂存区: {', '.join(file_patterns)}")
            
            return True
            
        except Exception as e:
            print(f"添加文件到暂存区失败: {e}")
            return False
    
    def commit(self, message: str = None, auto_message: bool = True) -> bool:
        """提交更改"""
        if not self.is_git_repo():
            return False
        
        try:
            # 检查是否有文件要提交
            if not self.repo.index.diff('HEAD') and not self.repo.untracked_files:
                print("没有文件需要提交")
                return True
            
            # 生成提交消息
            if message is None and auto_message:
                current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                message = GIT_COMMIT_MESSAGE_TEMPLATE.format(date=current_date)
            elif message is None:
                message = "自动更新"
            
            # 提交
            commit = self.repo.index.commit(message)
            print(f"提交成功: {commit.hexsha[:8]} - {message}")
            
            return True
            
        except Exception as e:
            print(f"提交失败: {e}")
            return False
    
    def push(self, remote: str = 'origin', branch: str = None) -> bool:
        """推送到远程仓库"""
        if not self.is_git_repo():
            return False
        
        try:
            if branch is None:
                branch = self.repo.active_branch.name
            
            # 检查远程仓库是否存在
            if remote not in [r.name for r in self.repo.remotes]:
                print(f"远程仓库 '{remote}' 不存在")
                return False
            
            # 推送
            origin = self.repo.remote(remote)
            push_info = origin.push(branch)
            
            for info in push_info:
                if info.flags & info.ERROR:
                    print(f"推送失败: {info.summary}")
                    return False
                else:
                    print(f"推送成功: {info.summary}")
            
            return True
            
        except Exception as e:
            print(f"推送失败: {e}")
            return False
    
    def pull(self, remote: str = 'origin', branch: str = None) -> bool:
        """从远程仓库拉取"""
        if not self.is_git_repo():
            return False
        
        try:
            if branch is None:
                branch = self.repo.active_branch.name
            
            # 检查远程仓库是否存在
            if remote not in [r.name for r in self.repo.remotes]:
                print(f"远程仓库 '{remote}' 不存在")
                return False
            
            # 拉取
            origin = self.repo.remote(remote)
            pull_info = origin.pull(branch)
            
            for info in pull_info:
                print(f"拉取完成: {info.note}")
            
            return True
            
        except Exception as e:
            print(f"拉取失败: {e}")
            return False
    
    def create_branch(self, branch_name: str, checkout: bool = True) -> bool:
        """创建新分支"""
        if not self.is_git_repo():
            return False
        
        try:
            # 检查分支是否已存在
            if branch_name in [branch.name for branch in self.repo.branches]:
                print(f"分支 '{branch_name}' 已存在")
                if checkout:
                    self.repo.git.checkout(branch_name)
                    print(f"切换到分支: {branch_name}")
                return True
            
            # 创建新分支
            new_branch = self.repo.create_head(branch_name)
            
            if checkout:
                new_branch.checkout()
                print(f"创建并切换到新分支: {branch_name}")
            else:
                print(f"创建新分支: {branch_name}")
            
            return True
            
        except Exception as e:
            print(f"创建分支失败: {e}")
            return False
    
    def setup_remote(self, remote_url: str, remote_name: str = 'origin') -> bool:
        """设置远程仓库"""
        if not self.is_git_repo():
            return False
        
        try:
            # 检查远程仓库是否已存在
            if remote_name in [r.name for r in self.repo.remotes]:
                # 更新远程仓库URL
                remote = self.repo.remote(remote_name)
                remote.set_url(remote_url)
                print(f"更新远程仓库 '{remote_name}': {remote_url}")
            else:
                # 添加新的远程仓库
                self.repo.create_remote(remote_name, remote_url)
                print(f"添加远程仓库 '{remote_name}': {remote_url}")
            
            return True
            
        except Exception as e:
            print(f"设置远程仓库失败: {e}")
            return False
    
    def auto_sync(self, files_to_add: List[str] = None, commit_message: str = None, 
                  push_to_remote: bool = True) -> bool:
        """自动同步：添加、提交、推送"""
        if not self.is_git_repo():
            print("不是Git仓库，正在初始化...")
            if not self.init_repo():
                return False
        
        try:
            # 1. 添加文件
            if not self.add_files(files_to_add):
                return False
            
            # 2. 提交更改
            if not self.commit(commit_message):
                return False
            
            # 3. 推送到远程（如果配置了远程仓库）
            if push_to_remote and self.repo.remotes:
                if not self.push():
                    print("推送失败，但本地提交成功")
                    return True
            
            print("Git自动同步完成")
            return True
            
        except Exception as e:
            print(f"Git自动同步失败: {e}")
            return False
    
    def get_file_history(self, file_path: str, max_count: int = 10) -> List[dict]:
        """获取文件的提交历史"""
        if not self.is_git_repo():
            return []
        
        try:
            commits = list(self.repo.iter_commits(paths=file_path, max_count=max_count))
            history = []
            
            for commit in commits:
                history.append({
                    'hash': commit.hexsha[:8],
                    'message': commit.message.strip(),
                    'author': str(commit.author),
                    'date': datetime.fromtimestamp(commit.committed_date).isoformat(),
                    'stats': commit.stats.files.get(file_path, {})
                })
            
            return history
            
        except Exception as e:
            print(f"获取文件历史失败: {e}")
            return []
    
    def cleanup_repo(self) -> bool:
        """清理仓库（删除未跟踪的文件等）"""
        if not self.is_git_repo():
            return False
        
        try:
            # 清理未跟踪的文件
            self.repo.git.clean('-fd')
            print("清理未跟踪的文件完成")
            
            # 垃圾回收
            self.repo.git.gc('--aggressive', '--prune=now')
            print("Git垃圾回收完成")
            
            return True
            
        except Exception as e:
            print(f"清理仓库失败: {e}")
            return False