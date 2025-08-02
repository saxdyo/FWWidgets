"""
Data health monitoring and auto-recovery system inspired by fw2.js
Provides data integrity checks, health monitoring, and automatic recovery mechanisms
"""

import os
import json
import time
import shutil
import hashlib
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging
from config import DATA_HEALTH_CONFIG, DATA_DIR, IMAGES_DIR, LOGS_DIR, LOGGING_CONFIG

# Setup logging
logging.basicConfig(
    level=getattr(logging, LOGGING_CONFIG['LEVEL']),
    format=LOGGING_CONFIG['FORMAT']
)
logger = logging.getLogger(__name__)


@dataclass
class HealthCheckResult:
    """Result of a health check operation"""
    check_name: str
    status: str  # 'healthy', 'warning', 'critical'
    message: str
    details: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)
    recovery_actions: List[str] = field(default_factory=list)


@dataclass
class DataIntegrityReport:
    """Report on data integrity status"""
    total_files: int = 0
    corrupted_files: int = 0
    missing_files: int = 0
    outdated_files: int = 0
    total_size_mb: float = 0.0
    last_backup_age_hours: float = 0.0
    health_score: float = 100.0
    recommendations: List[str] = field(default_factory=list)


class DataHealthMonitor:
    """
    Data health monitoring and auto-recovery system inspired by fw2.js
    Features:
    - Data integrity verification
    - Automatic corruption detection
    - Health score calculation
    - Auto-recovery mechanisms
    - Backup management
    - Performance monitoring
    - Anomaly detection
    """
    
    def __init__(self):
        self.data_dir = DATA_DIR
        self.images_dir = IMAGES_DIR
        self.logs_dir = LOGS_DIR
        self.backup_dir = os.path.join(self.data_dir, 'backups')
        
        # Ensure directories exist
        for directory in [self.data_dir, self.images_dir, self.logs_dir, self.backup_dir]:
            os.makedirs(directory, exist_ok=True)
        
        self.health_history = []
        self.last_check_time = 0
        self.recovery_stats = {
            'total_recoveries': 0,
            'successful_recoveries': 0,
            'failed_recoveries': 0,
            'last_recovery_time': 0
        }
        
        logger.info("Data health monitor initialized")
    
    def perform_health_check(self, full_check: bool = False) -> List[HealthCheckResult]:
        """
        Perform comprehensive health check of data and system
        """
        current_time = time.time()
        
        # Skip if checked recently (unless full check requested)
        if (not full_check and 
            current_time - self.last_check_time < DATA_HEALTH_CONFIG['CHECK_INTERVAL_HOURS'] * 3600):
            return self.health_history[-1] if self.health_history else []
        
        logger.info(f"Performing {'full' if full_check else 'standard'} health check...")
        
        results = []
        
        # 1. Data file integrity check
        results.append(self._check_data_files())
        
        # 2. Image files check
        results.append(self._check_image_files())
        
        # 3. Disk space check
        results.append(self._check_disk_space())
        
        # 4. Backup status check
        results.append(self._check_backup_status())
        
        # 5. Performance metrics check
        results.append(self._check_performance_metrics())
        
        if full_check:
            # 6. Full integrity verification
            results.append(self._check_data_integrity())
            
            # 7. Configuration validation
            results.append(self._check_configuration())
        
        # Record check time
        self.last_check_time = current_time
        self.health_history.append(results)
        
        # Keep only recent history
        if len(self.health_history) > 100:
            self.health_history = self.health_history[-50:]
        
        # Trigger auto-recovery if needed
        if DATA_HEALTH_CONFIG['AUTO_RECOVERY_ENABLED']:
            self._trigger_auto_recovery(results)
        
        logger.info(f"Health check completed: {len(results)} checks performed")
        return results
    
    def _check_data_files(self) -> HealthCheckResult:
        """Check integrity of data files"""
        try:
            json_files = [f for f in os.listdir(self.data_dir) if f.endswith('.json')]
            corrupted_files = []
            total_size = 0
            
            for file_name in json_files:
                file_path = os.path.join(self.data_dir, file_name)
                try:
                    file_size = os.path.getsize(file_path)
                    total_size += file_size
                    
                    # Try to parse JSON
                    with open(file_path, 'r', encoding='utf-8') as f:
                        json.load(f)
                        
                except (json.JSONDecodeError, OSError) as e:
                    corrupted_files.append(file_name)
                    logger.warning(f"Corrupted data file detected: {file_name} - {e}")
            
            # Determine status
            if not corrupted_files:
                status = 'healthy'
                message = f"All {len(json_files)} data files are healthy"
            elif len(corrupted_files) / len(json_files) < 0.1:  # Less than 10% corrupted
                status = 'warning'
                message = f"{len(corrupted_files)} corrupted files out of {len(json_files)}"
            else:
                status = 'critical'
                message = f"High corruption rate: {len(corrupted_files)}/{len(json_files)} files"
            
            return HealthCheckResult(
                check_name='data_files',
                status=status,
                message=message,
                details={
                    'total_files': len(json_files),
                    'corrupted_files': corrupted_files,
                    'total_size_mb': total_size / (1024 * 1024),
                    'corruption_rate': len(corrupted_files) / len(json_files) if json_files else 0
                },
                recovery_actions=['backup_restore', 'file_regeneration'] if corrupted_files else []
            )
            
        except Exception as e:
            return HealthCheckResult(
                check_name='data_files',
                status='critical',
                message=f"Data files check failed: {e}",
                recovery_actions=['system_recovery']
            )
    
    def _check_image_files(self) -> HealthCheckResult:
        """Check image files status"""
        try:
            if not os.path.exists(self.images_dir):
                return HealthCheckResult(
                    check_name='image_files',
                    status='warning',
                    message="Images directory does not exist",
                    recovery_actions=['create_directory']
                )
            
            image_files = [f for f in os.listdir(self.images_dir) 
                          if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
            
            corrupted_images = []
            total_size = 0
            
            # Sample check (don't check all images for performance)
            sample_size = min(100, len(image_files))
            sample_files = image_files[:sample_size] if len(image_files) > sample_size else image_files
            
            for file_name in sample_files:
                file_path = os.path.join(self.images_dir, file_name)
                try:
                    file_size = os.path.getsize(file_path)
                    total_size += file_size
                    
                    # Basic file integrity check
                    if file_size < 1024:  # Less than 1KB might be corrupted
                        corrupted_images.append(file_name)
                        
                except OSError:
                    corrupted_images.append(file_name)
            
            # Calculate total directory size
            total_dir_size = sum(
                os.path.getsize(os.path.join(self.images_dir, f))
                for f in os.listdir(self.images_dir)
                if os.path.isfile(os.path.join(self.images_dir, f))
            )
            
            corruption_rate = len(corrupted_images) / len(sample_files) if sample_files else 0
            
            if corruption_rate == 0:
                status = 'healthy'
                message = f"All sampled images ({sample_size}) are healthy"
            elif corruption_rate < 0.05:
                status = 'warning'
                message = f"Low corruption rate: {len(corrupted_images)}/{sample_size} sampled"
            else:
                status = 'critical'
                message = f"High image corruption: {len(corrupted_images)}/{sample_size} sampled"
            
            return HealthCheckResult(
                check_name='image_files',
                status=status,
                message=message,
                details={
                    'total_images': len(image_files),
                    'sampled_images': sample_size,
                    'corrupted_images': len(corrupted_images),
                    'total_size_mb': total_dir_size / (1024 * 1024),
                    'corruption_rate': corruption_rate
                },
                recovery_actions=['redownload_images'] if corrupted_images else []
            )
            
        except Exception as e:
            return HealthCheckResult(
                check_name='image_files',
                status='critical',
                message=f"Image files check failed: {e}",
                recovery_actions=['system_recovery']
            )
    
    def _check_disk_space(self) -> HealthCheckResult:
        """Check available disk space"""
        try:
            statvfs = os.statvfs(self.data_dir)
            total_space = statvfs.f_frsize * statvfs.f_blocks
            available_space = statvfs.f_frsize * statvfs.f_available
            used_space = total_space - available_space
            
            usage_percent = (used_space / total_space) * 100
            available_gb = available_space / (1024 ** 3)
            
            if available_gb > 10 and usage_percent < 90:
                status = 'healthy'
                message = f"Disk space healthy: {available_gb:.1f}GB available"
            elif available_gb > 5 and usage_percent < 95:
                status = 'warning'
                message = f"Disk space warning: {available_gb:.1f}GB available ({usage_percent:.1f}% used)"
            else:
                status = 'critical'
                message = f"Disk space critical: {available_gb:.1f}GB available ({usage_percent:.1f}% used)"
            
            return HealthCheckResult(
                check_name='disk_space',
                status=status,
                message=message,
                details={
                    'total_gb': total_space / (1024 ** 3),
                    'available_gb': available_gb,
                    'used_percent': usage_percent
                },
                recovery_actions=['cleanup_old_files', 'compress_data'] if status != 'healthy' else []
            )
            
        except Exception as e:
            return HealthCheckResult(
                check_name='disk_space',
                status='critical',
                message=f"Disk space check failed: {e}",
                recovery_actions=['system_recovery']
            )
    
    def _check_backup_status(self) -> HealthCheckResult:
        """Check backup status and recency"""
        try:
            backup_files = [f for f in os.listdir(self.backup_dir) if f.endswith('.json')]
            
            if not backup_files:
                return HealthCheckResult(
                    check_name='backup_status',
                    status='warning',
                    message="No backup files found",
                    recovery_actions=['create_backup']
                )
            
            # Find most recent backup
            latest_backup = max(
                backup_files,
                key=lambda f: os.path.getmtime(os.path.join(self.backup_dir, f))
            )
            
            backup_age = time.time() - os.path.getmtime(os.path.join(self.backup_dir, latest_backup))
            backup_age_hours = backup_age / 3600
            
            retention_days = DATA_HEALTH_CONFIG['BACKUP_RETENTION_DAYS']
            max_age_hours = retention_days * 24
            
            if backup_age_hours < 24:
                status = 'healthy'
                message = f"Recent backup available: {backup_age_hours:.1f} hours old"
            elif backup_age_hours < max_age_hours:
                status = 'warning'
                message = f"Backup aging: {backup_age_hours:.1f} hours old"
            else:
                status = 'critical'
                message = f"Backup too old: {backup_age_hours:.1f} hours old"
            
            return HealthCheckResult(
                check_name='backup_status',
                status=status,
                message=message,
                details={
                    'total_backups': len(backup_files),
                    'latest_backup': latest_backup,
                    'backup_age_hours': backup_age_hours,
                    'max_age_hours': max_age_hours
                },
                recovery_actions=['create_backup'] if status != 'healthy' else []
            )
            
        except Exception as e:
            return HealthCheckResult(
                check_name='backup_status',
                status='critical',
                message=f"Backup status check failed: {e}",
                recovery_actions=['create_backup']
            )
    
    def _check_performance_metrics(self) -> HealthCheckResult:
        """Check system performance metrics"""
        try:
            # Get system load information
            load_avg = os.getloadavg() if hasattr(os, 'getloadavg') else (0, 0, 0)
            
            # Check memory usage (simplified)
            import psutil
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            
            # Performance status
            if load_avg[0] < 2.0 and memory_percent < 80:
                status = 'healthy'
                message = "System performance is good"
            elif load_avg[0] < 5.0 and memory_percent < 90:
                status = 'warning'
                message = "System performance is degraded"
            else:
                status = 'critical'
                message = "System performance is poor"
            
            return HealthCheckResult(
                check_name='performance_metrics',
                status=status,
                message=message,
                details={
                    'load_average_1m': load_avg[0],
                    'load_average_5m': load_avg[1],
                    'load_average_15m': load_avg[2],
                    'memory_percent': memory_percent,
                    'memory_available_gb': memory.available / (1024 ** 3)
                },
                recovery_actions=['optimize_performance'] if status != 'healthy' else []
            )
            
        except Exception as e:
            return HealthCheckResult(
                check_name='performance_metrics',
                status='warning',
                message=f"Performance check failed: {e}",
                details={'error': str(e)}
            )
    
    def _check_data_integrity(self) -> HealthCheckResult:
        """Perform full data integrity verification"""
        try:
            integrity_issues = []
            
            # Check for required data files
            required_files = ['metadata.json', 'download_log.json']
            for required_file in required_files:
                file_path = os.path.join(self.data_dir, required_file)
                if not os.path.exists(file_path):
                    integrity_issues.append(f"Missing required file: {required_file}")
            
            # Check data consistency
            metadata_path = os.path.join(self.data_dir, 'metadata.json')
            if os.path.exists(metadata_path):
                try:
                    with open(metadata_path, 'r', encoding='utf-8') as f:
                        metadata = json.load(f)
                        
                    # Validate metadata structure
                    required_keys = ['last_updated', 'total_movies', 'version']
                    for key in required_keys:
                        if key not in metadata:
                            integrity_issues.append(f"Missing metadata key: {key}")
                            
                except Exception as e:
                    integrity_issues.append(f"Metadata corruption: {e}")
            
            if not integrity_issues:
                status = 'healthy'
                message = "Data integrity verification passed"
            elif len(integrity_issues) < 3:
                status = 'warning'
                message = f"Minor integrity issues: {len(integrity_issues)} found"
            else:
                status = 'critical'
                message = f"Major integrity issues: {len(integrity_issues)} found"
            
            return HealthCheckResult(
                check_name='data_integrity',
                status=status,
                message=message,
                details={
                    'integrity_issues': integrity_issues,
                    'issues_count': len(integrity_issues)
                },
                recovery_actions=['repair_data_integrity'] if integrity_issues else []
            )
            
        except Exception as e:
            return HealthCheckResult(
                check_name='data_integrity',
                status='critical',
                message=f"Integrity check failed: {e}",
                recovery_actions=['system_recovery']
            )
    
    def _check_configuration(self) -> HealthCheckResult:
        """Check system configuration validity"""
        try:
            config_issues = []
            
            # Check environment variables
            from config import TMDB_API_KEY
            if not TMDB_API_KEY:
                config_issues.append("TMDB_API_KEY not configured")
            
            # Check directory permissions
            for directory in [self.data_dir, self.images_dir, self.logs_dir]:
                if not os.access(directory, os.W_OK):
                    config_issues.append(f"No write permission for {directory}")
            
            if not config_issues:
                status = 'healthy'
                message = "Configuration is valid"
            else:
                status = 'warning'
                message = f"Configuration issues: {len(config_issues)} found"
            
            return HealthCheckResult(
                check_name='configuration',
                status=status,
                message=message,
                details={
                    'config_issues': config_issues,
                    'issues_count': len(config_issues)
                },
                recovery_actions=['fix_configuration'] if config_issues else []
            )
            
        except Exception as e:
            return HealthCheckResult(
                check_name='configuration',
                status='critical',
                message=f"Configuration check failed: {e}",
                recovery_actions=['system_recovery']
            )
    
    def _trigger_auto_recovery(self, health_results: List[HealthCheckResult]):
        """Trigger automatic recovery actions based on health check results"""
        critical_issues = [r for r in health_results if r.status == 'critical']
        
        if not critical_issues:
            return
        
        logger.warning(f"Triggering auto-recovery for {len(critical_issues)} critical issues")
        
        recovery_actions = set()
        for result in critical_issues:
            recovery_actions.update(result.recovery_actions)
        
        for action in recovery_actions:
            try:
                success = self._execute_recovery_action(action)
                if success:
                    self.recovery_stats['successful_recoveries'] += 1
                    logger.info(f"Auto-recovery action '{action}' completed successfully")
                else:
                    self.recovery_stats['failed_recoveries'] += 1
                    logger.error(f"Auto-recovery action '{action}' failed")
            except Exception as e:
                self.recovery_stats['failed_recoveries'] += 1
                logger.error(f"Auto-recovery action '{action}' failed with exception: {e}")
        
        self.recovery_stats['total_recoveries'] += len(recovery_actions)
        self.recovery_stats['last_recovery_time'] = time.time()
    
    def _execute_recovery_action(self, action: str) -> bool:
        """Execute a specific recovery action"""
        try:
            if action == 'create_backup':
                return self.create_backup()
            elif action == 'backup_restore':
                return self.restore_from_backup()
            elif action == 'cleanup_old_files':
                return self.cleanup_old_files()
            elif action == 'create_directory':
                os.makedirs(self.images_dir, exist_ok=True)
                return True
            elif action == 'repair_data_integrity':
                return self.repair_data_integrity()
            else:
                logger.warning(f"Unknown recovery action: {action}")
                return False
        except Exception as e:
            logger.error(f"Recovery action '{action}' failed: {e}")
            return False
    
    def create_backup(self) -> bool:
        """Create a backup of important data"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_filename = f"backup_{timestamp}.json"
            backup_path = os.path.join(self.backup_dir, backup_filename)
            
            # Collect data to backup
            backup_data = {
                'timestamp': timestamp,
                'version': '1.0',
                'data_files': {},
                'metadata': {}
            }
            
            # Backup JSON data files
            for filename in os.listdir(self.data_dir):
                if filename.endswith('.json') and not filename.startswith('backup_'):
                    file_path = os.path.join(self.data_dir, filename)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            backup_data['data_files'][filename] = json.load(f)
                    except Exception as e:
                        logger.warning(f"Failed to backup {filename}: {e}")
            
            # Save backup
            with open(backup_path, 'w', encoding='utf-8') as f:
                json.dump(backup_data, f, indent=2, ensure_ascii=False)
            
            # Cleanup old backups
            self._cleanup_old_backups()
            
            logger.info(f"Backup created: {backup_filename}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to create backup: {e}")
            return False
    
    def restore_from_backup(self, backup_filename: str = None) -> bool:
        """Restore data from backup"""
        try:
            if not backup_filename:
                # Find most recent backup
                backup_files = [f for f in os.listdir(self.backup_dir) if f.startswith('backup_')]
                if not backup_files:
                    logger.error("No backup files found for restoration")
                    return False
                backup_filename = max(backup_files)
            
            backup_path = os.path.join(self.backup_dir, backup_filename)
            
            with open(backup_path, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)
            
            # Restore data files
            for filename, data in backup_data.get('data_files', {}).items():
                file_path = os.path.join(self.data_dir, filename)
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Data restored from backup: {backup_filename}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to restore from backup: {e}")
            return False
    
    def cleanup_old_files(self) -> bool:
        """Clean up old files to free space"""
        try:
            cleaned_count = 0
            
            # Clean old backup files
            backup_files = []
            for filename in os.listdir(self.backup_dir):
                if filename.startswith('backup_'):
                    file_path = os.path.join(self.backup_dir, filename)
                    file_age = time.time() - os.path.getmtime(file_path)
                    backup_files.append((filename, file_age))
            
            # Keep only recent backups
            backup_files.sort(key=lambda x: x[1])  # Sort by age
            retention_seconds = DATA_HEALTH_CONFIG['BACKUP_RETENTION_DAYS'] * 24 * 3600
            
            for filename, age in backup_files:
                if age > retention_seconds:
                    os.remove(os.path.join(self.backup_dir, filename))
                    cleaned_count += 1
            
            logger.info(f"Cleaned up {cleaned_count} old files")
            return True
            
        except Exception as e:
            logger.error(f"Failed to cleanup old files: {e}")
            return False
    
    def _cleanup_old_backups(self):
        """Clean up old backup files"""
        try:
            backup_files = [f for f in os.listdir(self.backup_dir) if f.startswith('backup_')]
            backup_files.sort(reverse=True)  # Most recent first
            
            # Keep only the most recent 10 backups
            for old_backup in backup_files[10:]:
                os.remove(os.path.join(self.backup_dir, old_backup))
                
        except Exception as e:
            logger.warning(f"Failed to cleanup old backups: {e}")
    
    def repair_data_integrity(self) -> bool:
        """Repair data integrity issues"""
        try:
            # Create missing required files
            metadata_path = os.path.join(self.data_dir, 'metadata.json')
            if not os.path.exists(metadata_path):
                default_metadata = {
                    'version': '1.0',
                    'last_updated': datetime.now().isoformat(),
                    'total_movies': 0,
                    'health_status': 'repaired'
                }
                with open(metadata_path, 'w', encoding='utf-8') as f:
                    json.dump(default_metadata, f, indent=2)
            
            # Create missing download log
            log_path = os.path.join(self.data_dir, 'download_log.json')
            if not os.path.exists(log_path):
                default_log = {
                    'downloads': [],
                    'last_updated': datetime.now().isoformat(),
                    'total_downloads': 0
                }
                with open(log_path, 'w', encoding='utf-8') as f:
                    json.dump(default_log, f, indent=2)
            
            logger.info("Data integrity repaired")
            return True
            
        except Exception as e:
            logger.error(f"Failed to repair data integrity: {e}")
            return False
    
    def get_health_report(self) -> DataIntegrityReport:
        """Generate comprehensive health report"""
        # Perform health check
        health_results = self.perform_health_check()
        
        report = DataIntegrityReport()
        
        # Calculate health score based on check results
        total_checks = len(health_results)
        healthy_checks = sum(1 for r in health_results if r.status == 'healthy')
        warning_checks = sum(1 for r in health_results if r.status == 'warning')
        critical_checks = sum(1 for r in health_results if r.status == 'critical')
        
        if total_checks > 0:
            # Health score: 100 for healthy, 50 for warning, 0 for critical
            score = (healthy_checks * 100 + warning_checks * 50) / total_checks
            report.health_score = score
        
        # Populate report details
        for result in health_results:
            if result.check_name == 'data_files':
                report.total_files = result.details.get('total_files', 0)
                report.corrupted_files = len(result.details.get('corrupted_files', []))
            elif result.check_name == 'backup_status':
                report.last_backup_age_hours = result.details.get('backup_age_hours', 0)
        
        # Generate recommendations
        if critical_checks > 0:
            report.recommendations.append("Critical issues detected - immediate attention required")
        if warning_checks > 0:
            report.recommendations.append("Warning conditions present - monitor closely")
        if report.health_score < 80:
            report.recommendations.append("System health below optimal - consider maintenance")
        
        return report
    
    def get_stats(self) -> Dict[str, Any]:
        """Get health monitoring statistics"""
        return {
            'recovery_stats': self.recovery_stats,
            'last_check_time': self.last_check_time,
            'total_health_checks': len(self.health_history),
            'health_history_count': len(self.health_history)
        }


# Global instance
global_health_monitor = DataHealthMonitor()


def perform_health_check(full_check: bool = False) -> List[HealthCheckResult]:
    """Perform health check using global monitor"""
    return global_health_monitor.perform_health_check(full_check)


def get_health_report() -> DataIntegrityReport:
    """Get health report using global monitor"""
    return global_health_monitor.get_health_report()


def create_backup() -> bool:
    """Create backup using global monitor"""
    return global_health_monitor.create_backup()


def auto_recovery() -> bool:
    """Trigger auto-recovery using global monitor"""
    health_results = global_health_monitor.perform_health_check(full_check=True)
    critical_issues = [r for r in health_results if r.status == 'critical']
    
    if critical_issues:
        global_health_monitor._trigger_auto_recovery(health_results)
        return True
    return False