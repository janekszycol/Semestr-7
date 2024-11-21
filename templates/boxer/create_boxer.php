<?php
/** @var \App\Service\Router $router */

$title = 'Create Boxer Record';
$bodyClass = 'edit';

ob_start(); ?>
    <h1>Create Boxer Record</h1>
    <form action="<?= $router->generatePath('boxer-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . 'boxer_form.html.php'; ?>
        <input type="hidden" name="action" value="boxer-create">
    </form>
    <a href="<?= $router->generatePath('boxer-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';