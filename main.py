#!/usr/bin/env python3
"""
TMDB电影背景图爬取和自动更新主程序
"""

import os
import sys
import argparse
import schedule
import time
from datetime import datetime
from pathlib import Path

# 添加当前目录到Python路径
sys.path.append(str(Path(__file__).parent))

from tmdb_client import TMDBClient
from image_downloader import ImageDownloader
from data_manager import DataManager
from git_manager import GitManager
from config import MAX_IMAGES_PER_BATCH, UPDATE_SCHEDULE


class MovieBackgroundCrawler:
    """TMDB电影背景图爬虫主类"""
    
    def __init__(self):
        self.tmdb_client = TMDBClient()
        self.image_downloader = ImageDownloader()
        self.data_manager = DataManager()
        self.git_manager = GitManager()
        
        print("🎬 TMDB电影背景图爬虫已初始化")
    
    def crawl_and_download(self, categories=['popular'], pages_per_category=5, 
                          download_backdrops=True, download_posters=False,
                          auto_commit=True):
        """爬取并下载电影背景图"""
        print(f"\n🚀 开始爬取电影数据...")
        print(f"分类: {', '.join(categories)}")
        print(f"每分类页数: {pages_per_category}")
        
        all_movies = []
        
        # 爬取各分类电影
        for category in categories:
            print(f"\n📋 正在爬取 '{category}' 分类...")
            try:
                movies = self.tmdb_client.get_movies_with_backdrops(
                    category=category, 
                    pages=pages_per_category
                )
                
                if movies:
                    # 限制数量
                    if len(movies) > MAX_IMAGES_PER_BATCH:
                        movies = movies[:MAX_IMAGES_PER_BATCH]
                    
                    all_movies.extend(movies)
                    
                    # 保存电影数据
                    self.data_manager.save_movies_data(movies, category)
                    print(f"✅ 获取到 {len(movies)} 部电影")
                else:
                    print(f"⚠️  '{category}' 分类没有获取到电影")
                    
            except Exception as e:
                print(f"❌ 爬取 '{category}' 分类失败: {e}")
        
        if not all_movies:
            print("❌ 没有获取到任何电影数据")
            return False
        
        print(f"\n📥 开始下载图片，共 {len(all_movies)} 部电影...")
        
        # 下载图片
        try:
            download_results = self.image_downloader.download_movie_images(
                all_movies,
                download_backdrops=download_backdrops,
                download_posters=download_posters
            )
            
            # 获取下载统计
            stats = self.image_downloader.get_download_stats(download_results)
            
            # 保存下载日志
            self.data_manager.save_download_log(download_results, stats)
            
            # 打印统计信息
            self._print_download_stats(stats)
            
            # Git自动提交
            if auto_commit:
                self._auto_git_commit(stats)
            
            return True
            
        except Exception as e:
            print(f"❌ 下载图片失败: {e}")
            return False
    
    def _print_download_stats(self, stats):
        """打印下载统计信息"""
        print(f"\n📊 下载统计:")
        print(f"   总电影数: {stats['total_movies']}")
        print(f"   新下载背景图: {stats['backdrops_downloaded']}")
        print(f"   已存在背景图: {stats['backdrops_existed']}")
        if stats['posters_downloaded'] > 0 or stats['posters_existed'] > 0:
            print(f"   新下载海报: {stats['posters_downloaded']}")
            print(f"   已存在海报: {stats['posters_existed']}")
        print(f"   总下载大小: {stats['total_size'] / 1024 / 1024:.2f} MB")
    
    def _auto_git_commit(self, stats):
        """自动Git提交"""
        print(f"\n🔄 正在进行Git自动提交...")
        
        try:
            # 生成提交消息
            commit_message = (
                f"Update movie backgrounds - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
                f"- Downloaded {stats['backdrops_downloaded']} new backgrounds\n"
                f"- Total size: {stats['total_size'] / 1024 / 1024:.2f} MB\n"
                f"- Total movies: {stats['total_movies']}"
            )
            
            # 执行Git操作
            success = self.git_manager.auto_sync(
                files_to_add=None,  # 添加所有文件
                commit_message=commit_message,
                push_to_remote=True
            )
            
            if success:
                print("✅ Git自动提交成功")
            else:
                print("⚠️  Git自动提交失败")
                
        except Exception as e:
            print(f"❌ Git自动提交出错: {e}")
    
    def run_once(self, categories=['popular', 'top_rated'], pages=3):
        """运行一次爬取任务"""
        print(f"🎯 执行单次爬取任务")
        return self.crawl_and_download(
            categories=categories,
            pages_per_category=pages,
            download_backdrops=True,
            download_posters=False,
            auto_commit=True
        )
    
    def run_scheduler(self, categories=['popular', 'top_rated'], pages=3):
        """运行定时调度器"""
        print(f"⏰ 启动定时调度器")
        print(f"调度时间: 每天 {UPDATE_SCHEDULE['hour']:02d}:{UPDATE_SCHEDULE['minute']:02d}")
        
        # 设置定时任务
        schedule.every().day.at(f"{UPDATE_SCHEDULE['hour']:02d}:{UPDATE_SCHEDULE['minute']:02d}").do(
            self.run_once, categories=categories, pages=pages
        )
        
        print("📅 定时任务已设置，等待执行...")
        print("按 Ctrl+C 停止调度器")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # 每分钟检查一次
                
        except KeyboardInterrupt:
            print("\n👋 调度器已停止")
    
    def show_status(self):
        """显示当前状态"""
        print("📋 当前状态:")
        
        # 数据统计
        stats = self.data_manager.get_statistics()
        print(f"\n📊 数据统计:")
        print(f"   总电影数: {stats.get('total_movies', 0)}")
        print(f"   分类: {', '.join(stats.get('categories', []))}")
        print(f"   最后更新: {stats.get('last_updated', '未知')}")
        
        # Git状态
        git_status = self.git_manager.get_status()
        if git_status:
            print(f"\n🔧 Git状态:")
            print(f"   当前分支: {git_status.get('branch', '未知')}")
            print(f"   是否有未提交更改: {'是' if git_status.get('is_dirty', False) else '否'}")
            print(f"   提交总数: {git_status.get('commit_count', 0)}")
            
            last_commit = git_status.get('last_commit')
            if last_commit:
                print(f"   最后提交: {last_commit['hash']} - {last_commit['message'][:50]}...")
        
        # 检查TMDB API连接
        print(f"\n🔗 TMDB API连接测试:")
        try:
            test_movies = self.tmdb_client.get_popular_movies(1)
            if test_movies:
                print(f"   ✅ 连接正常，获取到 {len(test_movies)} 部电影")
            else:
                print(f"   ⚠️  连接异常，未获取到电影数据")
        except Exception as e:
            print(f"   ❌ 连接失败: {e}")
    
    def cleanup(self, days=30):
        """清理旧数据和文件"""
        print(f"🧹 清理 {days} 天前的数据...")
        
        # 清理旧图片
        removed_images = self.image_downloader.cleanup_old_images(days)
        
        # 清理旧数据
        removed_logs = self.data_manager.cleanup_old_data(days)
        
        # Git清理
        self.git_manager.cleanup_repo()
        
        print(f"✅ 清理完成:")
        print(f"   删除图片: {removed_images} 个")
        print(f"   删除日志: {removed_logs} 条")
    
    def export_data(self, output_file="movie_data_export.json"):
        """导出数据"""
        print(f"📤 导出数据到: {output_file}")
        success = self.data_manager.export_data(output_file)
        if success:
            print("✅ 数据导出成功")
        else:
            print("❌ 数据导出失败")


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='TMDB电影背景图爬虫')
    parser.add_argument('command', choices=['run', 'schedule', 'status', 'cleanup', 'export'],
                       help='执行的命令')
    parser.add_argument('--categories', nargs='+', 
                       default=['popular', 'top_rated'],
                       choices=['popular', 'top_rated', 'now_playing', 'upcoming'],
                       help='要爬取的电影分类')
    parser.add_argument('--pages', type=int, default=3,
                       help='每个分类爬取的页数')
    parser.add_argument('--days', type=int, default=30,
                       help='清理操作保留的天数')
    parser.add_argument('--output', type=str, default='movie_data_export.json',
                       help='导出文件名')
    
    args = parser.parse_args()
    
    # 创建爬虫实例
    crawler = MovieBackgroundCrawler()
    
    # 执行命令
    if args.command == 'run':
        print("🎬 执行单次爬取...")
        crawler.run_once(categories=args.categories, pages=args.pages)
        
    elif args.command == 'schedule':
        print("⏰ 启动定时调度...")
        crawler.run_scheduler(categories=args.categories, pages=args.pages)
        
    elif args.command == 'status':
        crawler.show_status()
        
    elif args.command == 'cleanup':
        crawler.cleanup(days=args.days)
        
    elif args.command == 'export':
        crawler.export_data(output_file=args.output)


if __name__ == '__main__':
    main()