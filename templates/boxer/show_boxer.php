<?php
/** @var \App\Model\Boxer $boxer */
/** @var \App\Service\Router $router */

$title = "{$boxer->getName()} ({$boxer->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $boxer->getName() ?></h1>
    <article>
        <p>Weight: <?= $boxer->getWeight() ?></p>
        <p>Record: <?= $boxer->getRecord() ?></p>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('boxer-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('boxer-edit', ['id'=> $boxer->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';