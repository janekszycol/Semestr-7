<?php
/** @var \App\Model\Boxer $boxer */
/** @var \App\Service\Router $router */

$title = "Edit Boxer {$boxer->getName()} ({$boxer->getId()})";
$bodyClass = 'edit';

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('boxer-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . 'boxer_form.html.php'; ?>
        <input type="hidden" name="action" value="boxer-edit">
        <input type="hidden" name="id" value="<?= $boxer->getId() ?>">
    </form>
    <form action="<?= $router->generatePath('boxer-delete') ?>" method="post">
        <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
        <input type="hidden" name="action" value="boxer-delete">
        <input type="hidden" name="id" value="<?= $boxer->getId() ?>">
    </form>
    <a href="<?= $router->generatePath('boxer-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';