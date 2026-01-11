package com.ckm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 基础Repository接口
 * 提供所有实体通用的查询方法
 */
@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID> {

    /**
     * 批量删除
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM #{#entityName} e WHERE e.id IN :ids")
    int deleteByIds(List<ID> ids);

    /**
     * 批量软删除（如果实体支持软删除）
     */
    @Modifying
    @Transactional
    @Query("UPDATE #{#entityName} e SET e.enabled = false WHERE e.id IN :ids")
    int softDeleteByIds(List<ID> ids);

    /**
     * 查找指定时间之后创建的记录
     */
    List<T> findByCreatedAtAfter(LocalDateTime dateTime);

    /**
     * 查找指定时间之前创建的记录
     */
    List<T> findByCreatedAtBefore(LocalDateTime dateTime);

    /**
     * 查找指定时间范围内的记录
     */
    List<T> findByCreatedAtBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    /**
     * 查找指定时间之后更新的记录
     */
    List<T> findByUpdatedAtAfter(LocalDateTime dateTime);

    /**
     * 查找指定时间之前更新的记录
     */
    List<T> findByUpdatedAtBefore(LocalDateTime dateTime);

    /**
     * 查找指定时间范围内更新的记录
     */
    List<T> findByUpdatedAtBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    /**
     * 检查是否存在指定ID的记录
     */
    boolean existsById(ID id);

    /**
     * 统计指定时间之后创建的记录数量
     */
    long countByCreatedAtAfter(LocalDateTime dateTime);

    /**
     * 统计指定时间之前创建的记录数量
     */
    long countByCreatedAtBefore(LocalDateTime dateTime);

    /**
     * 获取最近创建的记录
     */
    @Query("SELECT e FROM #{#entityName} e ORDER BY e.createdAt DESC")
    List<T> findTop10ByOrderByCreatedAtDesc();

    /**
     * 获取最近更新的记录
     */
    @Query("SELECT e FROM #{#entityName} e ORDER BY e.updatedAt DESC")
    List<T> findTop10ByOrderByUpdatedAtDesc();
}
